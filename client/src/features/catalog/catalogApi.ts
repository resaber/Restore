import { createApi } from '@reduxjs/toolkit/query/react';
import type { Product } from '../../app/models/product';
import { baseQueryWithErrorHandling } from '../../app/api/baseApi';
import type { ProductParams } from '../../app/models/productParams'; //導入前端網址列TypeScript保護參數設定
import { filterEmptyValues } from '../../lib/util';
import type { Pagination } from '../../app/models/pagination';

export const catalogApi = createApi({
  reducerPath: 'catalogApi', //在Redux store的名稱路徑
  //所有 endpoint 的基礎 API URL 後續的query以這為開頭 拿baseApi的資料 共用API的請求邏輯
  baseQuery: baseQueryWithErrorHandling,
  //定義所有可用的API操作(endpoints) API端點 前端可以用的API方法
  endpoints: (builder) => ({
    //元件使用時useFetchProductsQuery() 沒有參數
    // fetchProducts : builder.query<Product[],void>({
    //     //沒有參數 忽略傳入的number
    //     query: () => ({ url: 'product' }) // GET /product  //baseUrl + '/product'
    // }),

    //第一個是回傳的資料型別 第二個是參數型別 網址列後的QueryString
    //元件使用時 useFetchProductsQuery({ orderBy: 'price', pageNumber: 2, pageSize: 10 })

      fetchProducts: builder.query<{items : Product[] , pagination : Pagination}, ProductParams>({
        //productParams 等於我們傳入的ts包住的型別為ProductParams 的物件 這裡被當作參數處理
        query: (productParams) => {
          // // 把物件轉成 key-value 陣列 → 過濾掉空值 → 再轉回物件
          // const filterParams = Object.fromEntries(
              
          //   //把物件轉成陣列(key-value pairs)處理 在用fromEntries 轉回物件
          //   //[
          //   //   ['orderBy', 'price'],
          //   //   ['keyword', ''],
          //   //   ['types', []],
          //   //   ['pageNumber', 1],
          //   //   ['pageSize', 10]
          //   // ]
          //   //filter true的結果元素會被保留 並組成一個新的陣列
          //   Object.entries(productParams).filter(
          //     //解構只取第二個[key,value] filter不需要key 只要value就好
          //     //例如只要orderBy後面的那個value price
          //     ([, value]) =>
          //       value !== '' &&
          //       value !== null &&
          //       value !== undefined &&
          //       !(Array.isArray(value) && value.length === 0) // 排除空陣列 > false 過濾掉
          //   )
          // );

          return {
            url: 'product',
            // 這個method 寫在 lib> util.ts裡面 
            //RTK  productParams typeScript型別保護
            //query() 裡面把參數傳入 → util.ts過濾無效(例如空字串)）
            //留下乾淨參數 最後傳給後端
            params: filterEmptyValues(productParams),
          };
        }, //GET /product?orderBy=price&pageNumber=2&pageSize=10
        
        //處理後端回傳的資料格式 P1 Response回傳的資料 主體資料(body) 例如產品清單  JSON格式的字串
        //[
        //   { "id": 1, "name": "A" },
        //   { "id": 2, "name": "B" }
        //]

        //前端 RTK Query 或其他 React 程式中，要操作資料一定是「JS 物件」
        //P2 RTK Query 額外帶入的 meta 物件可用可不用 meta: FetchBaseQueryMeta | undefined RTK Query
        //主要是response Headers Status Code資訊 通常是要拿取Response headers中拿取特定欄位
        transformResponse:(items: Product[],meta) => {
          //? 代表我們可能meta response 可能undefined Pagination Header 把json格式的字串轉成程式碼可用的js物件
          const paginationHeader =meta?.response?.headers.get('Pagination');
          const pagination = paginationHeader? JSON.parse(paginationHeader) : null;
          return {items,pagination};
        }
    }),
    //number => productId
    fetchProductDetails: builder.query<Product, number>({
      query: (productId) => `product/${productId}`, //baseUrl + '/product/1'
    }),
    //P1 回傳的資料型別 JSON 物件包含brands types P2代表呼叫這個查詢不需要參數
    fetchFilters: builder.query<{ brands: string[]; types: string[] }, void>({
      //定義endpoint 呼叫 API GET /api/product/filters
      query: () => `product/filters`,
    }),
  }),
});

export const {
  useFetchProductDetailsQuery,
  useFetchProductsQuery,
  useFetchFiltersQuery,
} = catalogApi;
