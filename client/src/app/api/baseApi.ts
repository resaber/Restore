// 從 RTK Query 套件中匯入基礎查詢方法與型別
import { type BaseQueryApi, type FetchArgs, fetchBaseQuery } from "@reduxjs/toolkit/query";
import { startLoading, stopLoading } from "../layout/uiSlice";

// 建立一個基本的 fetch 查詢（設定 API 基底網址）
const customBaseQuery = fetchBaseQuery({
  baseUrl: 'https://localhost:5001/api/' //  後端 API 的 base URL
});

// 模擬延遲（例如 loading 過場效果，這邊延遲 1 秒）
const sleep = () => new Promise (resolve => setTimeout(resolve,1000));

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
    const { status, data } = result.error; // 取得錯誤的狀態碼與回傳內容 解構
    console.log({ status, data });         // 將錯誤印出來（方便除錯）狀態碼和錯誤內容
  }

  // 回傳查詢結果（成功或失敗都會回傳）
  return result;
};