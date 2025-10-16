using System;
using API.DTOS;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

//Identity 的服務 SignInManager<User> 登入/登出/驗證 邏輯
//建構子注入 (Constructor Injection)，ASP.NET Core 的 DI 會自動注入進來 
//裡面也可以透過 UserManager<User> 來建立或管理使用者
public class AccountController(SignInManager<User> signInManager) : BaseAPIController
{
    //api/account/register 對應identity 路由
    // - Task: 非同步方法
    // - ActionResult: 可以回傳各種 HTTP 狀態碼 (200, 400, 401...)
    [HttpPost("register")]
    //引入Dto確保 強型別提示
    public async Task<ActionResult> RegisterUser(RegisterDto registerDto)
    {
        //User AspNetUsers 預設User物件屬性有兩個必填屬性 UserName 和 Password
        //前端給Email 後端實際上是用UserName
        //Email 選填
        var user = new User { UserName = registerDto.Email, Email = registerDto.Email };

        //密碼會經過 Identity 的密碼策略檢查 (大小寫、數字、特殊字元...)
        var result = await signInManager.UserManager.CreateAsync(user, registerDto.Password);

        // 把 Identity 回傳的錯誤逐一加入到 ModelState : ControllerBase的一個屬性 專門儲存表單錯誤 一個字典 多組key-value pairs
        // - error.Code: 錯誤代碼 (例如 PasswordTooShort)
        // - error.Description: 錯誤訊息 (例如 "Passwords must be at least 6 characters.")
        if (!result.Succeeded)
        {
            
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }

            return ValidationProblem(); //400 BadRequest 並附上ModelState內容
        }

        await signInManager.UserManager.AddToRoleAsync(user, "Member");
        return Ok();
    }

    //取得使用者 資訊 
    //api/account/user-info
    //401 先門口驗證過 MiddleWare檢查 檢查通過才能進入controller 對應到Program.cs 
    //app.UseAuthentication(); app.UseAuthorization();  // 先驗證身份 再判斷權限
    [Authorize] //已登入 cookie/JWT授權過後 才可使用這API 沒有cookie情況下 會自動回傳401 並不會執行以下內容 對標  const {data : user,isError} = useUserInfoQuery(); isError 會是true
    [HttpGet("user-info")]
    //進來再驗證一次
    public async Task<ActionResult> GetUserInfo()
    {
        //User ControllerBase提供的屬性 是 ClaimsPrincipal 型別，裡面有登入者身分資訊(Claims)
        //User.Identity.Name使用者名稱 / IsAuthenticated是否登入 // Claims
        //根據 目前的驗證方式 : 因為有在DI 正確註冊 Identity 和 Authentication
        if (User.Identity?.IsAuthenticated == false)
        {
            //沒登入 204 NoContent 也可以選擇回傳401 看狀況使用
            //204 代表回傳空值 對應到登出後 前端組件Navbar拿到的user 是undefined 是空值 
            return NoContent();
        }

        //UserManager 從 ClaimsPrincipal 取回當前已登入的對應的 User 實體
        //AspNetUsers 找使用者
        var user = await signInManager.UserManager.GetUserAsync(User);

        //token / cookie失效 401  找不到當前使用者
        if (user == null) return Unauthorized();

        //找這使用者的角色 陣列顯示 例如["Admin","Member"]
        //取回此使用者的角色清單 (AspNetUserRoles → AspNetRoles)
        var roles = await signInManager.UserManager.GetRolesAsync(user);

        //回傳前端 屬性json 資料
        return Ok(new
        {
            user.Email,
            user.UserName,
            Roles = roles //json "roles" : [x,y]
        });
    }

    //log out 使用者

    [HttpPost("logout")]
    public async Task<ActionResult> Logout()
    {
        await signInManager.SignOutAsync(); //清除瀏覽器上的cookie 
        return NoContent(); //http response 
    }

    //已登入才可更新地址 /api/account/address  
    [Authorize]
    //更新地址 回傳一個 ActionResult<Address>物件 並附帶 Address的Json
    [HttpPost("address")]
    public async Task<ActionResult<Address>> CreateOrUpdateAddress(Address address)
    {
        //先去確認Users資料表有沒有 這個地址，再去找第一個使用者名稱一致 的使用者
        var user = await signInManager.UserManager.Users
                    .Include(x => x.Address)
                    .FirstOrDefaultAsync(x => x.UserName == User.Identity!.Name); //!空值忽略 除錯

        //左邊是Identity框架底下的Users資料表(AspNetUsers) Identity 框架包裝過的 IQueryable<User>
        //右邊User 是ControllerBase裡面的一個屬性物件ClaimsPrincipal型別 代表的是使用者身分資訊物件
        //Identity是 ClaimsIdentity型別 代表的是使用者"驗證"資料物件(內有名稱 是否通過驗證) 
        //而這屬性裡面有Name的屬性 (Identity框架預設會把 UserName屬性 也會複製儲存一分到 ClaimsIdentity 這裡的Name屬性)

        if (user == null) return Unauthorized();

        //EF Core 會判斷要更新還是新增 Address
        user.Address = address; //導覽屬性 透過外鍵屬性掛接 等於user Address屬性 連接到另一張Address表

        //EF Core 會依照「關聯追蹤」機制，自動判斷 user.Address 也需要更新（因為有設好關聯） 
        var result = await signInManager.UserManager.UpdateAsync(user); // 把資料 直接更新回AspNetUsers資料表 等於這裡面有很多User每個User又有其各自的Address外鍵連接的Address資料表，看有沒有設定

        if (!result.Succeeded) return BadRequest("更新用戶地址發生錯誤");

        return Ok(user.Address);
    }

    //使用者登入 才可以看地址
    [Authorize]
    [HttpGet("address")]
    public async Task<ActionResult<Address>> GetSavedAddress()
    {
        //LINQ 是  Entity Framework Core 框架 (ORM框架=>物件導向) LINQ轉換成SQL 語法查詢資料庫 回傳 C#物件
        var address = await signInManager.UserManager.Users
            .Where(x => x.UserName == User.Identity!.Name) //找Identity 底下那個Claim物件 裡面key是 Name 對應的那個value
            .Select(x => x.Address)  //只拿地址欄位資料
            .FirstOrDefaultAsync();

        if (address == null) return NoContent(); // 沒有地址 可能還未創立

        return address; //ASP NET Core Web API 框架 httpResponse 200OK C#物件自動序列化成json物件
    }
}
