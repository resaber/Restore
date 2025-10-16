// 從 RTK Query 套件中匯入基礎查詢方法與型別
import { type BaseQueryApi, type FetchArgs, fetchBaseQuery } from "@reduxjs/toolkit/query";
import { startLoading, stopLoading } from "../layout/uiSlice";
import { toast } from "react-toastify";
import { router } from "../routes/Routes";

// 建立一個基本的 fetch 查詢（設定 API 基底網址）
const customBaseQuery = fetchBaseQuery({
  baseUrl: 'https://localhost:5001/api/',//  後端 API 的 base URL
  credentials: 'include'  // 這樣每次請求就會自動附上 cookie
});
//400 badRequest data 是 string , 401 則是有title Property我們會用到  , validation error 是 error objects  string[]
type ErrorResponse =
  | string //有時是純字串
  | { title: string } //有時是含有title的物件
  | { errors: string[] }; //有時是  errors:[]陣列



// 模擬延遲（例如 loading 過場效果，這邊延遲 1 秒）
const sleep = () => new Promise(resolve => setTimeout(resolve, 1000));

// 封裝一個有錯誤處理功能的 baseQuery 函式（RTK Query 會用到）return Promise
export const baseQueryWithErrorHandling = async (
  args: string | FetchArgs,        //  查詢參數（API 的 endpoint 或 request 設定）
  api: BaseQueryApi,               //  RTK Query 提供的 API 工具（包含 dispatch, getState 等） 
  extraOptions: object             //  額外的選項（自己或 RTK 用得到）
) => {
  //api的method dispatch(startLoading()) 引入uiSlice裡面的action加入到api dispatch method
  api.dispatch(startLoading());
  //  模擬 loading 動畫用的 sleep（可刪）
  await sleep();

  // 執行真正的 API 請求（透過 baseUrl + 你提供的 args (例如/product)
  const result = await customBaseQuery(args, api, extraOptions);
  api.dispatch(stopLoading());

  //  如果請求失敗，印出錯誤資訊
  if (result.error) {

    //讀取originStatus code 400  RTK_ Query 處理我們那個text/plan資料 對應API BadRequest("text")
    //且這個錯誤物件 originalStatus有值
    //如果不是這種text資料 正常讀取這error的status就好
    const originStatus = result.error.status === 'PARSING_ERROR' && result.error.originalStatus
      ? result.error.originalStatus
      : result.error.status

    //儲存data 並要遵守ErrorResponse 這三種格式 typeGuard
    const responseData = result.error.data as ErrorResponse;

    switch (originStatus) {
      //取得400
      case 400:
        // 
        if (typeof responseData === 'string') toast.error(responseData);
        //如果responseData 有 errors屬性
        else if ('errors' in responseData) {
          //陣列 轉 字串 對應RegisterForm 的 error as {message: string};age
          throw Object.values(responseData.errors).flat().join(', ')
        }
        else toast.error(responseData.title);
        break;
      case 401:
        //if responseData is null 'in' can't be used in null object result to TypeError
        //401 得到的嚴格來說是一個error物件 且responseData是個物件且裡面有一個title屬性 且要符合{title : string}
        if (responseData && typeof responseData === 'object' && 'title' in responseData)
         toast.error(responseData.title);
        break;
      case 404:
        if (responseData && typeof responseData === 'object' && 'title' in responseData)
          router.navigate('/not-found');
        break;
      case 500:
        if (responseData && typeof responseData === 'object')
          //把錯誤資料變數重新包裝成一個物件 state 裡面有一個key error屬性，然後把物件傳給React-Router 當作state
          //導向server-error頁面 透過 state 傳遞錯誤資料（error: responseData）
          //對應到routes.tsx 裡面要新增路徑
          router.navigate('/server-error', { state: { error: responseData } })
        break;

      default:
        break;
    }
  }

  // 回傳查詢結果（成功或失敗都會回傳）
  return result;
};