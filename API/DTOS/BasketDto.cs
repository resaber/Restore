using System;

namespace API.DTOS;

public class BasketDto
{
   
    //儲存到cookie string型別 可以讓使用者 瀏覽器的儲存空間有這屬性資料
    public required string BasketId { get; set; }
    //導覽屬性到BasketItem 一個購物車可以有很多items
    public List<BasketItemDto> Items { get; set; } = [];
    // public List<BasketItem> Items { get; set; } = []; //C# syntax sugar

}
