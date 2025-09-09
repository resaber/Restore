using System;

namespace API.RequestHelpers;

public class PaginationParams
{
    private const int MaxPageSize = 50;
    public int PageNumber { get; set; } = 1;
    private int _pageSize = 10; //每頁10筆商品
    public int PageSize 
    {
        get => _pageSize;
        //使用者輸入頁數若大於 一頁顯示數量限制 例如999則設定為每頁50筆 否則設定為使用者輸入的value例如20 每頁20筆
        set => _pageSize = value > MaxPageSize ? MaxPageSize : value;
    }
    
}
