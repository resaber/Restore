using API.Data;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{

    public class ProductController(StoreContext context) : BaseAPIController
    {
        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetProducts(
            // 改寫 表面參數查詢條件
            // string? 允許這兩個參數可填可不填
            // string? orderBy,
            // string? keyword,
            // string? brands,
            // string? types
            // 網址列參考字串 
            [FromQuery] ProductParams productParams
            )
        {

            //EF Core 提供的LINQ搜尋 AsQueryable() 動態拼接查詢條件 延遲查詢 對應到Extensions擴充方法
            //這個context.Products 的型別實際上應該是 IQueryable<Product>
            var query = context.Products
                .Sort(productParams.OrderBy) //排序邏輯 寫在擴充方法裡
                .Search(productParams.Keyword)
                .Filter(productParams.Brands, productParams.Types)
                .AsQueryable(); //DbSet<Product> 本來就是 IQueryable<Product> 可寫可不寫 主要用來明確語意 表示接下來做LINQ拼接查詢

            //回傳那個分頁的商品資訊 引入PageList<T> class 的靜態方法ToPageList

            // 1.先從 productParams 取得目前頁碼 PageNumber 和每頁數量 PageSize
            //(實際上這兩個屬性是定義在 PaginationParams 中，ProductParams 繼承自它）

            //2.呼叫 ToPageList() 時：
            //    - 使用 query.CountAsync() 計算總筆數
            //    - 使用 Skip().Take() 取得該頁商品資料
            //    - 回傳 PageList<Product>：
            //    是 List<Product> 的子類別（所以它本身就是一份商品清單）
            //    同時額外包含 Metadata（分頁資訊：總筆數、頁碼、總頁數）


            //用PageList<T> Class 的靜態方法 使用預設頁數第一頁 但每頁10筆商品資料 
            //深層參數 分頁控制
            var products = await PageList<Product>.ToPageList(query,
                 productParams.PageNumber, productParams.PageSize);

            //用 HttpExtensions裡面的 類別擴充方法 分層把分頁資訊 藏在header裡面
            Response.AddPaginationHeader(products.Metadata);

            //回傳資訊給前端瀏覽器Json  給key名稱items 和value 裡面包含 products.Metadata
            //把那樣的商品清單放進去 PageList<Product> 和 products.Metadata（這是分頁資訊，例如總頁數、目前第幾頁）
            //2 key 第一個是items 第二個key是metadata
            //前端取得json格式的資料
            // {
            //    "items": [...商品清單...],
            //    "metadata": { 總筆數、每頁筆數、目前頁數、總頁數 }
            // }



            //也可以單寫 products.Metadata C# 匿名型別的自動命名行為 會自動給key metadata
            // return Ok(new { Items = products, Metadata = products.Metadata });

            //把商品清單 分層寫在body裡面
            return products;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int? id)
        {
            if (id == null)
                return BadRequest("id不得為null");
            var product = await context.Products.FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
                return NotFound("沒有這筆Product資訊");
            return Ok(product);
        }

        //給個filter參數 給IActionResult 因為不確定回傳甚麼型別(匿名物件)
        //GetFilters 提供前端 可選的篩選條件 例如  "brands": ["星巴克", "路易莎", "cama"],
        //"types": ["主食", "飲料", "咖啡"]
        [HttpGet("filters")]
        public async Task<IActionResult> GetFilters()
        {
            //品牌清單 且不要重複 每個都是unique List<string>
            var brands = await context.Products.Select(x => x.Brand).Distinct().ToListAsync(); // ["星巴克", "路易莎", "超商"]
            var types = await context.Products.Select(x => x.Type).Distinct().ToListAsync(); //["咖啡", "主食", "飲料"]


            //{
            //   "brands": ["星巴克", "路易莎", "超商"],
            //   "types": ["咖啡", "主食", "飲料"]
            // }

            //每筆資料的key是string value是object  好處是 可以動態增刪 key-value 的資料結構。
            // return Ok(new Dictionary<string, object> {
            //     { "brands",brands},
            //     {"types" , types}
            // });

            //回傳匿名物件前端brands types 兩個key的集合  C# 的匿名型別（anonymous type）自動命名行為 自動給key字串形式 value 就是LList<string>
            
            return Ok(new { brands, types });
        }

    }
}
