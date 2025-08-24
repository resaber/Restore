using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities;

[Table("BasketItems")]
public class BasketItem
{
    public int Id { get; set; }
    public int Quantity { get; set; }


    // 外鍵 (FK) → 對應到 Product.Id
    public int ProductId { get; set; }

    // 導覽屬性 (Navigation Property) → 可以直接存取 Product 物件
    public required Product Product { get; set; }
    public int BasketId { get; set; }
    //建立導覽屬性 這個屬性不能是 null，也不會真的是 null，先給 null，但 EF 會填起來
    public Basket Basket { get; set; } = null!;
}