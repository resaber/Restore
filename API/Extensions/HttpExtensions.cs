using System;
using System.Text.Json;
using API.RequestHelpers;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Net.Http.Headers;

namespace API.Extensions;
//把分頁資訊寫在Header裡面
public static class HttpExtensions
{
    //static method ，P1 this HttpResponse  是 HttpResponse 型別的「擴充方法」目標
    //P2 呼叫這個方法時要額外傳入的資料 參數
    public static void AddPaginationHeader(this HttpResponse response, PaginationMetaData metaData)
    {
        //Json序列化設定 JsonSerializerOptions設定物件裡面 屬性命名規則屬性用CamelCase駝峰式命名，第一個字是小寫 後面每個單字開頭大寫
        var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
        //設定回傳的header內容 自訂Header屬性名稱 meta物件轉乘Json options為序列化輸出設定
        response.Headers.Append("Pagination", JsonSerializer.Serialize(metaData, options));
        //瀏覽器安全限制(Cors)只能讀取幾個標準 Header（例如 Content-Type）
        //讓前端允許讀取自訂的header: Pagination header ， P1必須顯式告訴瀏覽器允許曝光
        //"Access-Control-Expose-Headers" → CORS 設定標頭，告訴瀏覽器「這些自訂 Header 前端也可以存取」
        // 這樣瀏覽器才會把它暴露給前端 JS (例如 fetch/axios 的 response.headers.get("Pagination"))
        response.Headers.Append(HeaderNames.AccessControlExposeHeaders, "Pagination");
    }
}
