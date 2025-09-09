using System;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions;

public static class ProductExtensions
{
    //P1 這個型別的物件都可以使用這個擴充方法 P2傳進來的參數
    public static IQueryable<Product> Sort(this IQueryable<Product> query, string? orderBy)
    {
        //orderBy 字串 動態決定排序方式
        query = orderBy switch
        {
            //後端API篩選方式
            "price" => query.OrderBy(p => p.Price),
            "priceDesc" => query.OrderByDescending(p => p.Price),
            //其餘狀況 進行名字排序 default 其他情況
            _ => query.OrderBy(p => p.Name)
        };
        return query;
    }

    //關鍵字搜尋商品功能
    public static IQueryable<Product> Search
    (this IQueryable<Product> query, string? keyword)
    {
        if (string.IsNullOrEmpty(keyword)) return query;

        var lowerKeyword = keyword.Trim().ToLower();

        return query.Where(p => p.Name.ToLower().Contains(lowerKeyword));
    }

    //品牌 和 type 
    public static IQueryable<Product> Filter(this IQueryable<Product> query, string? brands, string? types)
    {
        var brandList = new List<string>();
        var typeList = new List<string>();

        if (!string.IsNullOrEmpty(brands))
        {
            // 傳統寫法string[] 轉成 List<string>
            // brandList.AddRange(brands.ToLower().Split(",").ToList());

            //新寫法[..]List<string>搭配AddRange 展開為元素集合 .Split()產生string[] [..] 展開為新集合
            brandList.AddRange([.. brands.ToLower().Split(',')]);
        }
        if (!string.IsNullOrEmpty(types))
        {
            //新寫法[..]List<string>搭配AddRange 展開為元素集合 .Split()產生string[] [..] 展開為新集合
            typeList.AddRange([.. types.ToLower().Split(',')]);
        }
        //如左邊為true 則所有資料保留 query.Where(x => true) 顯示全部商品 或是有商品顯示右邊
        //使用者輸入的是品牌字串集合（brandList），
        //拿每筆商品的 Brand 屬性去檢查：它是否包含在這個集合中
        query = query.Where(x => brandList.Count == 0 || brandList.Contains(x.Brand.ToLower()));
        query = query.Where(x => typeList.Count == 0 || typeList.Contains(x.Type.ToLower()));

        return query;
    }

    public static IQueryable<Product> Filter2(this IQueryable<Product> query, string? brands, string? types)
    {
        var brandList = new List<string>();
        var typeList = new List<string>();

        if (!string.IsNullOrEmpty(brands))
        {
            brandList.AddRange([.. brands.ToLower().Split(',')]);
        }
        if (!string.IsNullOrEmpty(types))
        {
            brandList.AddRange([.. types.ToLower().Split(',')]);
        }
        query = query.Where(x => brandList.Count == 0 || brandList.Contains(x.Brand.ToLower()));
        return query;
    }
}
