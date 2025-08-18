import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";

export const errorApi = createApi({
    reducerPath : 'errorApi', //狀態名稱（在 store 中的 key）
    baseQuery : baseQueryWithErrorHandling, //所有 API 共用的 fetch 規則 token baseUrl
    endpoints : (builder) => ({ //各個 API endpoint 這個部門有哪些查詢或 mutation，像 get500Error()
        //error 沒有回傳值 也不會有參數
        get400Error : builder.query<void,void>({
            query : ()  => ({url : 'buggy/bad-request'}) //baseUrl + 'buggy/bad-request'
        }),
          get401Error : builder.query<void,void>({
            query : ()  => ({url : 'buggy/unauthorized'}) //baseUrl + 'buggy/bad-request'
        }),
          get404Error : builder.query<void,void>({ //泛型 builder.query<回傳資料型別, 傳入參數型別>
            query : ()  => ({url : 'buggy/not-found'}) //baseUrl + 'buggy/bad-request'
        }),
          get500Error : builder.query<void,void>({
            query : ()  => ({url : 'buggy/server-error'}) //baseUrl + 'buggy/bad-request'
        }),
          getValidationError : builder.query<void,void>({
            query : ()  => ({url : 'buggy/validation-error'}) //baseUrl + 'buggy/bad-request'
        }),
    })
})

export const{
    useLazyGet400ErrorQuery,
    useLazyGet401ErrorQuery,
    useLazyGet404ErrorQuery,
    useLazyGet500ErrorQuery,
    useLazyGetValidationErrorQuery
} = errorApi;