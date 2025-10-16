import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import type { User } from "../../app/models/user";

//RTK query 建立 讓元件使用 然後呼叫後端對應的api 
export const accountApi2 = createApi({
    reducerPath : 'accountApi2',
    baseQuery: baseQueryWithErrorHandling,
    endpoints: (builder) => ({
        login: builder.mutation<void,object>({
            query: (creds) => {
                return {
                    url : 'login?useCookies=true',
                    method: 'POST',
                    body: creds
                }
            }
        }),
        register: builder.mutation<void,object>({
            query: (creds) => {
                return{
                    url : 'account/register',
                    method: 'POST',
                    body:creds
                }
            }
        }),
        //<
        userInfo: builder.query<User,void>({
            query: () => 'account/user-info'
        }),
        logout: builder.query<void,void>({
            query: () => ({
                url : 'account/logout',
                method: 'POST'
            })
        })
    })
});

export const {useLoginMutation,useRegisterMutation,useLogoutQuery} = accountApi2;