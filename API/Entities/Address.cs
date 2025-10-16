using System;
using System.Text.Json.Serialization;

namespace API.Entities;

public class Address
{
    //因為Id 不是必要的 所以應該也建立成Dto 對前端隱藏敏感資訊 確保前端瀏覽器無法拿到Id
    [JsonIgnore]
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Line1 { get; set; }
    public string? Line2 { get; set; }
    public required string City { get; set; }
    public required string State { get; set; }
    //物件轉成json時 這屬性的key改成postal_code 也可以不改給前端 預設給的json postalCode也行 
    [JsonPropertyName("postal_code")]
    public required string PostalCode { get; set; }
    public required string Country { get; set; }
}
