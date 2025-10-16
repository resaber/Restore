using System;
using Microsoft.AspNetCore.Identity;

namespace API.Entities;

//套件先安裝identity 套件 引入IdentityUser
public class User : IdentityUser
{
    // 外鍵Id 對應導覽屬性 User AddressId <=> Address Id 外鍵 AddressId 對應到另一端 主鍵的Id
    public int? AddressId { get; set; }
    //導覽屬性 連接到Address資料表 Id屬性
    public Address? Address { get; set; }
}
