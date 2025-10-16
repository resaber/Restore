using API.Data;
using API.Entities;
using API.MiddleWare;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddDbContext<StoreContext>(options =>
{
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddCors();
builder.Services.AddTransient<ExceptionMiddleWare>();


// 註冊 ASP.NET Core Identity 服務到 DI 容器，指定自訂 User 類別（繼承自 IdentityUser）
// AddIdentityApiEndpoints<TUser>() 會自動註冊 UserManager、SignInManager、RoleManager
// 並預設啟用 Cookie 型態的登入驗證（AuthenticationScheme = Identity.Application）


//設定的 IdentityOptions 會控制密碼強度、使用者名稱規則等
builder.Services.AddIdentityApiEndpoints<User>(opt =>
{
    // IdentityOptions.User 設定區：要求每個帳號的 Email 必須唯一
    opt.User.RequireUniqueEmail = true;

    // IdentityOptions.Password 設定區（如果未設定會套用預設強密碼規則）
    // opt.Password.RequiredLength = 6;
    // opt.Password.RequireDigit = true;
    // opt.Password.RequireUppercase = true;
    // opt.Password.RequireNonAlphanumeric = true;
})
// 加入角色管理（可對應 Admin / Member 等身份）
.AddRoles<IdentityRole>()
// 指定 Entity Framework 使用的 DbContext 來源（資料表會自動對應 AspNetUsers, AspNetRoles 等）
.AddEntityFrameworkStores<StoreContext>();




var app = builder.Build();

//加入請求處理流程中，讓每次 HTTP request 都會建立一個新的 middleware
//來攔截與處理例外 請求結束才會自動釋放資源
app.UseMiddleware<ExceptionMiddleWare>();

if (app.Environment.IsDevelopment())
{
    app.MapScalarApiReference();
    app.MapOpenApi();
}

// Configure the HTTP request pipeline.

app.UseCors(option =>
{
    //開放Cors給React框架3000使用
    option.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("https://localhost:3000");
});
//順序要對 先看身分再給權限
//身分驗證 中介 使用者身分 cookie / JWT Token 先確認身分
app.UseAuthentication();
// 授權中介 身分驗證結果 判斷有沒有權限
app.UseAuthorization();

app.MapControllers();
//mao identity API  
app.MapGroup("api").MapIdentityApi<User>(); // api/login
await DbInitializer.InitDb(app); //應用程式啟動時，自動初始化資料庫與帳號角色等內容

app.Run();