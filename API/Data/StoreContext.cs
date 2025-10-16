using System;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;


//  StoreContext 同時具備兩種功能： Identity框架來建立資料庫
//  保留 DbContext 原本的功能（例如操作 Products, Baskets, saveChanges() 等）
//  加入 Identity 框架的功能（自動帶入 AspNetUsers, AspNetRoles 等資料表）
//  這讓我們可以直接用 Identity 做身分驗證、註冊、登入、角色授權等功能
//  IdentityDbContext<User> 中的 User(Entity) 必須繼承自 IdentityUser，才能使用完整的身份系統功能


public class StoreContext(DbContextOptions options) : IdentityDbContext<User>(options)
{
    public required DbSet<Product> Products { get; set; }
    //DbSet
    public required DbSet<Basket> Baskets { get; set; }

    //  當 Entity Framework 建立資料模型時，會自動呼叫這個方法 
    //  設定資料表關聯、預設資料（種子資料 seed）、欄位屬性等等
    protected override void OnModelCreating(ModelBuilder builder)
    {
        //會自動建立 ASP.NET Identity 需要的所有資料表 會自動建立 AspNetUsers AspNetRoles AspNetUserRoles 之類的表
        //呼叫父類別的 OnModelCreating，讓 IdentityDbContext 設定好內建的資料表結構 這邊是兩個角色資料
        base.OnModelCreating(builder);
        // 針對 IdentityRole 資料表（也就是 AspNetRoles）插入種子資料 預設角色設定AspNetRoles
        builder.Entity<IdentityRole>()
        .HasData(
            //建立Roles 資料表
            new IdentityRole
            {
                Id = "c13efd9c-ab2c-48ac-b282-a3ffe50294c7", //GUID 自訂 手動設定 GUID online 避免每次更新migration 都產生新的動態Id 
                Name = "Member", //顯示名稱 給人看得
                //框架設定 要轉成大寫 因為會應到  userManager.AddToRoleAsync(user, "Member")，會把P2轉換成大小和底下這個比對 程式對比用
                NormalizedName = "MEMBER" //Identity 框架內部在比對角色時，會把你輸入的角色名稱轉成大寫再去比對 NormalizedName
            },
            new IdentityRole
            {
                Id = "8a7a3e7c-53cf-478c-a232-8c58c2b6f6bc",
                Name = "Admin",
                NormalizedName = "ADMIN"
            }
        );

    }
}
