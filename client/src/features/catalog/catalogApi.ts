

import { createApi } from "@reduxjs/toolkit/query/react";
import type { Product } from "../../app/models/product";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";

export const catalogApi = createApi({
    reducerPath : 'catalogApi',
    //所有 endpoint 的基礎 API URL 後續的query以這為開頭 拿baseApi的資料
    baseQuery : baseQueryWithErrorHandling,
    //定義所有可用的API操作(endpoints)
    endpoints : (builder) => ({
        //第一個是回傳的資料型別 第二個是參數型別
        fetchProducts : builder.query<Product[],void>({
            //沒有參數 忽略傳入的number
            query : () => ({url : 'product'}) //baseUrl + '/product'
        }),
        //number => productId
        fetchProductDetails : builder.query<Product,number>({
            query : (productId) => `product/${productId}` //baseUrl + '/product/1'
        })
    })
});

export const {useFetchProductDetailsQuery,useFetchProductsQuery} = catalogApi;