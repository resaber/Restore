import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithErrorHandling } from '../../app/api/baseApi';
import { Item, type Basket } from '../../app/models/basket';
import type { Product } from '../../app/models/product';

//product 可能是Product 或是 Item 同時支援 商品列表新增商品 和 在購物車裡修改數量 兩種情境
function isBasketItem(product: Product | Item): product is Item {
  //先暫時斷言 product 是 Item型別的 型別斷言  檢查這型別有沒有quantity屬性
  //如果回傳結果是true 則product is Item  / return false 時，編譯器會自動知道「不是 Item」→ 從 Product | Item 中剩下的型別就是 Product。
  return (product as Item).quantity !== undefined;
}

//建立購物車API 以及對應部門的API路徑
export const basketApi = createApi({
  reducerPath: 'basketApi', //store 的命名
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ['Basket'], //定義此 API 可能使用的「標籤類型」，用來做快取標記與更新
  endpoints: (builder) => ({
    //第一個是回傳的資料型別 第二個是參數型別
    //其他部分用useQuery 可以用data屬性接住query傳回來的結果
    fetchBasket: builder.query<Basket, void>({
      query: () => ({ url: 'basket' }), //baseUrl + '/basket' (GET)
      // 底下的mutation 藉由失效 Tag快取標籤促使 RTK Query 發現 Basket 這個標籤對應到 fetchBasket
      // → 自動重新執行 fetchBasket（也就是重新 GET /basket），保持畫面與後端同步
      providesTags: ['Basket'], //RTK Query：這個查詢提供 Basket 這個快取標籤
    }),

    //一個mutation P2內的參數同時處理 傳入參數兩種型別的可能  isBasketItem function解決這個問題
    //使用複數Parameters時 要改用mutation 然後要把這Post method 規格寫出來
    //第一個是回傳的型別 P2是參數
    addBasketItem: builder.mutation<
      //回傳Basket型別的物件
      Basket,
      //供的參數物件型別（也就是 payload） product 可能是 Product 也可能是 Item
      { product: Product | Item; quantity: number }
    >({
      //這個query需要參數 所以要用query : ({P1,P2}) => ({})
      query: ({ product, quantity }) => {
        //  先判斷 product 是不是 Basket 裡的 Item 因為兩個情況 1.商品列表頁面 新增商品 2. 購物車頁面修改商品數量
        //  如果是 Item，拿它的 productId（因為 Item 通常是 "已存在購物車的東西"，會有 productId）
        //  如果是 Product，拿它的 id（因為 Product 來自商品目錄）
        const productId = isBasketItem(product)
          ? product.productId
          : product.id;
        return {
          url: `basket?productId=${productId}&quantity=${quantity}`,
          method: 'POST',
        };
      },
      //mutation 觸發時立即執行 P1呼叫傳進來的參數，P2 RTK Query 提供的工具(api) dispatch 快取變更的動作 + queryFulfilled 一個Promise 等待mutation是否完成
      onQueryStarted: async (
        { product, quantity },
        { dispatch, queryFulfilled }
      ) => {
        //檢查此設要的是 購物車已經存在的商品子項目的商品id // 還是商品列表新增的商品ID
        const isItem = isBasketItem(product);
        const productId = isItem ? product.productId : product.id;
        let isNewBasket = false;

        //將結果 儲存在patchResult 失敗了就回滾
        const patchResult = dispatch(
          //P1用來更新哪個查詢的快取 這邊是fetchBasket
          //P2這個查詢本身沒有參數所以undefined P3 快取資料傳進(draft)來操作，來進行查詢快取資料的函式
          //P3 RTK會自動用Immer工具 callback 當成「recipe」，記錄「怎麼修改」，最後生成一份新的 state，寫進快取。
          //fetchBasket 本來就被定義成 builder.query<Basket, void>(...)。 所以可以知道得到的回傳是購物車物件
          // updateQueryData 快取更新
          basketApi.util.updateQueryData('fetchBasket', undefined, (draft) => {
            //快取裡有沒有basketId 建立這個flag做判斷
            if (!draft?.basketId) isNewBasket = true;

            //如果已經有了購物車物件
            if (!isNewBasket) {
              // 在購物車快取 (draft.items) 中，尋找是否已經有相同 productId 的商品
              //  find() 會回傳符合條件的那一筆 item，如果找不到會回傳 undefined

              const existingItem = draft.items.find(
                (item) => item.productId === productId
              );

              if (existingItem)
                existingItem.quantity += quantity; //有商品的情況下加上數量
              else
                draft.items.push(
                  isItem
                    ? product
                    : //ES6 展開運算子...product 複製product所有欄位 , 另外設定 自己有的欄位productId = product.id 和新增購物車需要的數量欄位
                      //算是 滿足Redux Store 的官方規格，要求傳入store存放的必須是plain object例如純json的物件
                      { ...product, productId: product.id, quantity }
                ); //如果沒有這個商品，就建立一個新的購物車項目
            }
          })
        );

        try {
          //  等待真正的 POST /basket 完成 等待查詢完成
          await queryFulfilled;
          if(isNewBasket)
            //如果是第一次建立購物車，則失效原本的 購物車快取 ，重新讀取 GET /basket，拿最新的購物車資料回來
            dispatch(basketApi.util.invalidateTags(['Basket']))
          //  成功 → 什麼都不用做，保留剛剛的樂觀更新
          // （可選）若想更保險，也能在這裡 invalidateTags 逼退快取重抓：
        } catch (error) {
          //  失敗 → 回滾剛剛的樂觀更新，恢復快取成原狀
          //  這行就是把 updateQueryData 做的改動「撤銷」
          console.log(error);
          patchResult.undo();
        }
      },
    }),
    removeBasketItem: builder.mutation<
      void,
      { productId: number; quantity: number }
    >({
      query: ({ productId, quantity }) => ({
        url: `basket?productId=${productId}&quantity=${quantity}`,
        method: 'DELETE',
      }),
      // 樂觀更新邏輯
      onQueryStarted: async (
        //args 參數傳遞 P1
        { productId, quantity },
        //API工具 P2
        { dispatch, queryFulfilled }
      ) => {
        const patchResult = dispatch(
          //P1對應endPointName，對應哪個query快取  P2:fetchBasket 這個 query 沒有參數，所以傳 undefined P3 : recipe食譜 這姑query快取的資料
          basketApi.util.updateQueryData('fetchBasket', undefined, (draft) => {
            //回傳要移除的商品索引
            //在購物車內的購物車子項目陣列裡，找出那個 產品編號跟要移除的一樣 的商品，它排在這購物車第幾個索引位置
            const itemIndex = draft.items.findIndex(
              (item) => item.productId === productId
            );
            //如果有找到 對應索引，記錄下是在這購物車物件Items陣列中第幾個索引
            if (itemIndex >= 0) {
              draft.items[itemIndex].quantity -= quantity;
              if (draft.items[itemIndex].quantity <= 0) {
                //扣掉後數量小於等於0移除商品陣列中的那個索引 和指定要刪除的元素數量
                draft.items.splice(itemIndex, 1);
              }
            }
          })
        );

        //處理這個query狀態
        try {
          //等待mutation 請求完成
          await queryFulfilled;
          //如果失誤 印出錯誤 並回滾這個樂觀分析(不進行刪除的動作)
        } catch (err) {
          console.error(err);
          //updateQueryData 回滾這次快取的樂觀分析(還原刪除的狀態)
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useFetchBasketQuery,
  useAddBasketItemMutation,
  useRemoveBasketItemMutation,
} = basketApi; //把這query匯出
