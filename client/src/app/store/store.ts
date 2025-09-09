
import { counterSlice } from '../../features/contact/counterReducer';// 🔸從 Redux Toolkit 匯入 legacy_createStore（較接近傳統 Redux 寫法）
// 在沒有使用 createSlice 或 middleware 時可使用這個方式
import { configureStore ,legacy_createStore } from "@reduxjs/toolkit";

// 🔸引入 reducer（用來處理狀態變化邏輯）
// 這邊引入剛剛寫好的 counterReducer
import counterReducer from "../../features/contact/counterReducer";
import { useDispatch, useSelector } from 'react-redux';
import { catalogApi } from '../../features/catalog/catalogApi';
import { uiSlice } from '../layout/uiSlice';
import { errorApi } from '../../features/about/errorApi';
import { basketApi } from '../../features/basket/basketApi';
import { catalogSlice } from '../../features/catalog/catalogSlice';

// 🔸封裝 store 的建立邏輯
// 建立 Redux store，並將 reducer 傳入
// 後續可以在應用中用 <Provider store={...}> 提供這個 store
export function configureTheStore() {
  return legacy_createStore(counterReducer);
}

//kit 用法
export const store = configureStore({
    reducer :{
        // APi區塊 動態API
        // 右邊是RTK Query API 產生的reducer函式  右邊是value
        // 左邊是動態屬性名稱 左邊是key
        [catalogApi.reducerPath] : catalogApi.reducer,
        [errorApi.reducerPath] : errorApi.reducer,
        [basketApi.reducerPath] : basketApi.reducer,
        //其他slice reducer


        //自定義的slices
        // reducer 代表整個 Redux store 的主控區，每個 key 是一個 state 區塊
        // 右邊的counterSlice.reducer 是這個切片的邏輯處理器，裡面包含所有這塊 state 的行為（像 increment, decrement）
        // 左邊的counter 是我們自定義的 state 區塊名稱（會變成 state.counter）
        counter : counterSlice.reducer,
        //加入ui slice
        ui : uiSlice.reducer,
        catalog : catalogSlice.reducer
      
    },
    //middleWare區塊
    middleware:(GetDefaultMiddleware) =>
      GetDefaultMiddleware().concat(
        catalogApi.middleware,
        errorApi.middleware,
        basketApi.middleware)

})

  // Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
  export type RootState = ReturnType<typeof store.getState>
  // Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
  export type AppDispatch = typeof store.dispatch


// ✅ 建立具型別的自訂 Hook 官方文件react-reducer
// 用官方推薦的 withTypes() 寫法，讓元件使用 Redux 時具備強型別
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()