using System;
using API.Data;
using API.DTOS;
using API.Entities;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class BasketController(StoreContext context) : BaseAPIController
{
    //先建立這個購物車ID
    public int Id { get; set; }
    //儲存到cookie string型別 可以讓使用者 瀏覽器的儲存空間有這屬性資料
    public required string BasketId { get; set; }
    //導覽屬性到BasketItem 一個購物車可以有很多items
    public List<BasketItem> Items { get; set; } = new List<BasketItem>();
    // public List<BasketItem> Items { get; set; } = []; //C# syntax sugar


    [HttpGet]
    public async Task<ActionResult<BasketDto>> GetBasket()
    {
        //取得購物車
        var basket = await RetrieveBasket();

        if (basket == null)
            return NoContent();
        //用Basket擴充方法 回傳減少程式複雜性
        return basket.ToDto();
    }



    //新增購物車功能
    [HttpPost]
    //回傳一個Dto物件
    public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)
    {
        //transaction 這個區塊 都成功才會儲存回DB 

        // get basket from cookies
        var basket = await RetrieveBasket();

      
        // create basket 建立購物車
        // 沒有購物車的情況下建立
        basket ??= CreateBasket();

        // get product
        //用主鍵去找 商品資料
        var product = await context.Products.FindAsync(productId);
        if (product == null) return BadRequest("無法加入這個品項到購物車");

        // add item to basket
        basket.AddItem(product, quantity);

        // SaveChangesAsync() 回傳受影響筆數，如果 > 0 表示成功
        var result = await context.SaveChangesAsync() > 0;

        // [6] 回傳 201 Created 給前端，並執行查詢購物車的方法
        // 這筆資料是透過 GetBasket 這個方法可以再次取得的  轉移到那個action方法實際上路徑還是
        // GET /api/basket（由 GetBasket() 決定的路由）
        if (result)
            return CreatedAtAction(nameof(GetBasket), basket.ToDto());

        // 如果資料庫儲存失敗，回傳錯誤
        return BadRequest("更新購物車途中出現錯誤");
    }



    //刪除購物車商品 或是數量
    [HttpDelete]
    public async Task<ActionResult<BasketDto>> RemoveBasketItem(int productId, int quantity)
    {
        //  取得購物車
        var basket = await RetrieveBasket();
        if (basket == null) return NotFound("無法建立購物車");



        //查找對應商品項目 並進行刪除
        var item = basket.Items.FirstOrDefault(i => i.ProductId == productId);
        if (item == null)
            return NotFound("購物車沒有此類商品");

        //減少商品數量或移除項目 小於等於0的情況下 把這個商品移除購物車
        item.Quantity -= quantity;
        if (item.Quantity <= 0)
            basket.Items.Remove(item);

        // 儲存至資料庫
        var result = await context.SaveChangesAsync() > 0;
        if (result)
            return Ok(basket.ToDto()); // return 200 並回傳basketDto物件 也適用擴充方法達成的basketExtensions

        return BadRequest("更新購物車途中出現錯誤");
    }

    private Basket CreateBasket()
    {
        //UUID 全域識別碼
        var basketId = Guid.NewGuid().ToString();
        var CookieOptions = new CookieOptions
        {
            //這個Cookie是必須的
            IsEssential = true,
            //過期時間30天後
            Expires = DateTime.Now.AddDays(30)
        };
        //新增cookie 名稱, 值basketId 字串,CookieOption 到期日
        Response.Cookies.Append("basketId", basketId, CookieOptions);
        var basket = new Basket { BasketId = basketId };
        //Basket 加入EFCore資料追蹤 還未寫入資料庫 
        context.Baskets.Add(basket);

        //回傳Basket物件
        return basket;
    }

    //取得購物車的方法
    private async Task<Basket?> RetrieveBasket()
    {
        return await context.Baskets
        //導入購物車 內容品項資料
        .Include(x => x.Items)
        .ThenInclude(x => x.Product)
        //找到 資料庫對應cookies basketId一樣的購物車代號
        .FirstOrDefaultAsync(x => x.BasketId == Request.Cookies["basketId"]);
    }
}
