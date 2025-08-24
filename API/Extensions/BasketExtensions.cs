using System;
using API.DTOS;
using API.Entities;

namespace API.Extensions;

public static class BasketExtensions
{
    public static BasketDto ToDto(this Basket basket) //basket.ToDto Basket Entity類別擴充的方法
    {
        
        //回傳Dto物件
        return new BasketDto
        {
            BasketId = basket.BasketId,
            // 將購物車中 這個集合的每一元素轉換成 BasketItemDto 
            // basket.Items =>每個項目是BasketItem 轉換成 BasketItemDto
            Items = basket.Items.Select(x => new BasketItemDto
            {
                // 商品的主鍵 ID（對應 Products 資料表）
                ProductId = x.ProductId,
                // 右邊是basketItem 資料表 導覽屬性關聯Product資料表的屬性
                Name = x.Product.Name,
                // 右邊是basketItem 資料表 導覽屬性關聯Product資料表的屬性
                Price = x.Product.Price,
                Brand = x.Product.Brand,
                Type = x.Product.Type,
                PictureUrl = x.Product.PictureUrl,
                Quantity = x.Quantity
            }).ToList()
        };
    }
}
