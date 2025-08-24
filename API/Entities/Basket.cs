using System;

namespace API.Entities;

public class Basket
{
    //先建立這個購物車ID
    public int Id { get; set; }
    //儲存到cookie string型別 可以讓使用者 瀏覽器的儲存空間有這屬性資料
    public required string BasketId { get; set; }
    //導覽屬性到BasketItem 一個購物車可以有很多items
    public List<BasketItem> Items { get; set; } = new List<BasketItem>();
    // public List<BasketItem> Items { get; set; } = []; //C# syntax sugar


    public void AddItem(Product product, int quantity)
    {
        //商品是空的，則顯示錯誤訊息
        if (product == null)
            ArgumentNullException.ThrowIfNull(product);
        if (quantity <= 0)
            throw new ArgumentException("數量要大於0", nameof(quantity));
        //用參數傳進來的Product做傳入 找到了existingItem 會是一個BasketItem
        //找不到會是null
        var existingItem = FindItem(product.Id);
        //如果購物車 沒有就新增該商品導覽屬性 和數量
        //有的話就新增該商品數量
        if (existingItem == null)
        {
            Items.Add(new BasketItem
            {
                Product = product,
                Quantity = quantity,
            });
        }
        else
        {
            existingItem.Quantity += quantity;
        }
    }


    public void RemoveItem(int productId, int quantity)
    {
        if (quantity <= 0) throw new ArgumentException("數量必須大於0", nameof(quantity));
        var item = FindItem(productId);
        if (item == null) return;

        item.Quantity -= quantity;
        //如果該品項數量小於0 從購物車主體裡面的 集合Items移除
        if (item.Quantity <= 0)
            Items.Remove(item);
    }

    //回傳可能是BasketItem 或是null
    private BasketItem? FindItem(int productId)
    {
        //這是 Basket 類別裡的集合（List）BasketItem，存放所有購物車的商品 (BasketItem)。
        // 去這集合理找第一個 ProductId === productId
        // 右邊是商品資料表主鍵的 Id屬性 左邊是BasketItem的外鍵 用來指向Product資料表某個商品
        return Items.FirstOrDefault(item => item.ProductId == productId);
    }
}
