using System;

namespace API.RequestHelpers;

//商品參數繼承 頁數number和頁數的size(每頁多少筆資料) 網址列的字串搜尋 真正的分頁資訊在PaginationParams
public class ProductParams : PaginationParams
{
    public string? OrderBy { get; set; }
    public string? Keyword { get; set; }
    public string? Brands { get; set; }
    public string? Types { get; set; }

}
