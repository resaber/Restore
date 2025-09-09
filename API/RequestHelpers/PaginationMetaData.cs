using System;

namespace API.RequestHelpers;

//商品的資訊 例如查詢結果有多少商品 我們頁數最大容量有多少 目前有幾頁 
public class PaginationMetaData
{
    //總共有多少筆商品
    public int TotalCount { get; set; }
    //每頁顯示多少筆商品
    public int PageSize { get; set; }
    //第幾頁
    public int CurrentPage { get; set; }
    //總頁數
    public int TotalPages { get; set; }
}
