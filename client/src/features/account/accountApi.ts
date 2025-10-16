//引入的要是query/react
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import type { User } from "../../app/models/user";
import type { LoginSchema } from "../../lib/schemas/loginSchema";
import { router } from "../../app/routes/Routes";
import { toast } from "react-toastify";




//也是建立RTK Query 
export const accountApi = createApi({
    reducerPath : 'accountApi', //Reducer store API Slice 對應的名稱
    //引入baseApi 設定的基本路徑  'https://localhost:5001/api/' (baseUrl errorHandling)
    baseQuery : baseQueryWithErrorHandling,
    tagTypes: ['UserInfo'], //一定要註冊 可能會被使用 的資料標籤類型 登入/登出 要重新抓取的資料
    endpoints: (builder) => ({
        //登入P1 void 沒有回傳值 P2 LoginSchema 傳入一個物件(帳號、密碼)
        login : builder.mutation<void,LoginSchema>({
            //有個參數creds 參數 型別為object 前端將body內的json資料傳給後端API
            query : (creds) => {
                return {
                    url:'login?useCookies=true', //後端APi /api/login 後端設定cookie 回傳前端
                    method: 'POST',
                    body: creds //使用者登入資訊傳給後端API = RTK Query : JSON.stringify(creds)
                }
            },
            //使快取失效 建立新的快取
            //onQueryStarted() RTK query 這個mutation啟動時 額外執行的操作
            //使'UserInfo'這個標籤失效 讓其他"有使用這個Tag標籤的"query 自動重新Fetch資料
            //(_) _ 代表沒有參數 Redux dispatch，觸發其他slice裡的action，queryFulfilled 一個Promise 請求成功時 resolve 失敗throw錯誤
            async onQueryStarted(_,{dispatch,queryFulfilled}) {
                try {
                    await queryFulfilled; //等待API 執行完成
                    //accountApi slice 必須已經在 store.ts 中註冊為 reducer 與 middleware
                    //清除快取
                    dispatch(accountApi.util.invalidateTags(['UserInfo'])); //使API Slice 讀tag 或是說 使所有使用UserInfo 這標籤的query 其快取失效 下次有元件使用這個 query（或 refetch）時，才會發送 API 請求
                }catch(error) {
                    console.log(error);
                }
            }
        }),
        //P2 RegisterSchema 傳入型別物件(帳號、密碼)
        register: builder.mutation<void,object>({
            query : (creds) => {
                return{
                    url : 'account/register', //api位置 api/account/register
                    method: 'POST',
                    body: creds, //註冊資料,
                    // responseHandler : 'text' //：確保成功回覆不會被解析錯誤（即使回傳空內容或空 JSON）而拒絕 ***
                }
            },
            async onQueryStarted(_,{queryFulfilled}){
                try{
                    //API執行完成
                    await queryFulfilled;
                    toast.success("註冊完成 導入登入頁面"); //登入後執行
                    router.navigate('/login');
                }catch(error){
                    console.log(error);
                    throw error; //傳給組件 RegisterForm
                }
            }
        }),
        //代表這個query沒有參數 GET method
        //回傳User物件 符合models/user.ts(型別斷言) void 沒有參數傳給後端
        //query取得資料時 這個快取資料有UserInfo標籤
        //login後 會執行這個endpoint 因為這裡面有對應的Tag標籤 被失效 這邊會重新觸發這個endpoint RTK query 重新發送API請求
        userInfo:builder.query<User,void>({
            query : () => 'account/user-info',
            providesTags: ['UserInfo'] //這個query對應UserInfo快取 單一標籤
        }),
        //mutation 副作用請求 代表會改變後端伺服器狀態 POST/PUT/DELETE
        //清除伺服器上的cookie 沒有回傳值也沒有參數
        //P1 P2 void no return no args
        logout: builder.mutation<void,void>({
            query: () => ({
                url: 'account/logout',
                method: 'POST'
            }),
            async onQueryStarted(_,{dispatch,queryFulfilled}){
                //等候端 API執行完畢
                //await signInManager.SignOutAsync();  後端清除登入 cookie
                await queryFulfilled;
                //同樣使這 RTK query有特定標籤的快取失效 重新發送API 更新所有有用到UserInfo這標籤的快取
                dispatch(accountApi.util.invalidateTags(['UserInfo']));
                //使用路由 登出後 重新導向首頁路由 對應HomePage組件
                router.navigate('/');
            }
        })
    })
})
//Auto-fetch useUserInfoQuery / useLazyUserInfoQuery 必須手動fetch資料
export const {useLoginMutation,useRegisterMutation,useUserInfoQuery,useLazyUserInfoQuery,useLogoutMutation} = accountApi;