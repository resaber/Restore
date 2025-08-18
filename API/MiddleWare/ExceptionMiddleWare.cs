

using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace API.MiddleWare
{
    //IHostEnvironment 判斷目前環境
    //ILogger<ExceptionMiddleWare> 紀錄日誌
    public class ExceptionMiddleWare(IHostEnvironment env, ILogger<ExceptionMiddleWare> logger) : IMiddleware
    {
        //第一個參數HttpContext http request/response上下文
        //RequestDelegate pipeline下一個middleWare 的委派method
        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            //處理http request/response pipeline middleWare 請求
            try
            {
                await next(context);

            }
            catch (Exception error)
            {
                await HandleException(context, error);

            }
        }

        private async Task HandleException(HttpContext context, Exception error)
        {
            //record 那個錯誤 和 錯誤訊息 到日誌系統
            logger.LogError(error, error.Message);

            //return json to browser
            context.Response.ContentType = "application/json";
            //status code : 500
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            //設立NETCore 要回傳的 錯誤訊息模型ProblemDetails C#自帶的錯誤訊息物件
            var response = new ProblemDetails
            {
                Status = 500,
                //確認所處環境: 開發環境 顯示堆疊追蹤
                Detail = env.IsDevelopment() ?
                    error.StackTrace?.ToString()
                    //正式環境隱藏 Detail   
                    : null,
                Title = error.Message //錯誤訊息內容  會取 Exception("伺服器錯誤") 中的字串 例如 API位置 server-error Exception

            };

            //Json序列化 為camelCase 格式化 
            var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
            // 回傳瀏覽器錯誤物件  序列化成 JSON格式資料
            var json = JsonSerializer.Serialize(response, options);

            //錯誤內容 寫入HTTP回應 
            await context.Response.WriteAsync(json);

        }
    }
}