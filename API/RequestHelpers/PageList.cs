using System;
using Microsoft.CodeAnalysis;
using Microsoft.EntityFrameworkCore;

namespace API.RequestHelpers;

//某頁的查詢結果與分頁資訊 
//繼承List<T>
//資料清單的容器 兩個class分離 資料容器和 分頁各自運作

public class PageList<T> : List<T>//Product
{
    //分頁資訊屬性，用來傳回總筆數、目前頁碼、總頁數、當前頁數商品筆數等 拿來傳遞分頁資料
    //分頁資訊的描述
    public PaginationMetaData Metadata { get; set; }

    //建構子 建立 PageList 實體的時候就要給資料與分頁資訊
    //List<T> items 某頁的商品清單 例如每頁10筆 我要傳入的是第二頁的商品集合那就是[11~20]
    public PageList(List<T> items, int count, int pageNumber, int pageSize)
    {
        //分頁資訊 
        Metadata = new PaginationMetaData
        {
            TotalCount = count, //總商品筆數 18
            PageSize = pageSize, //每頁商品數量 10
            CurrentPage = pageNumber, //目前第幾頁 1
            TotalPages = (int)Math.Ceiling(count / (double)pageSize) //例如46筆資料 每頁有10商品 所以是五頁 2
        };
        //將特定頁資料加入到 PageList<T> 集合中，例如瀏覽第二頁，就會把第二頁內容(items)
        AddRange(items);
    }

    //執行分頁之前 先.CountAsync() 拿到全部筆數，避免先.Skip().Take() 再 .Count()，只會拿到特定頁數的那頁商品筆數
    //之後再用Skip().Take() 取得當前頁數 資料
    //泛型方法 查詢結果回傳 PageList<T>

    public static async Task<PageList<T>> ToPageList
    (
        IQueryable<T> query
        , int pageNumber
        , int pageSize
    )
    {
        //計算查詢結果的總筆數（尚未分頁） 回傳這query篩選後有多少筆資料
        var count = await query.CountAsync(); //18

        // 根據目前頁碼與每頁數量，用 Skip / Take 取得該頁的資料 
        //  例如：第 2 頁、每頁 10 筆 ➜ 跳過 10 筆，取後面 10 筆
        var items = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
        // 呼叫建構子建立 PageList<T> 實體 
        // 裡面包含商品清單（items） 
        // 也會根據參數自動建立 Metadata（總筆數、頁數、目前頁碼等）
        return new PageList<T>(items, count, pageNumber, pageSize);
    }

}
