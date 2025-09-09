import type { ProductParams } from "../../app/models/productParams";
import { createSlice } from '@reduxjs/toolkit';

//建立states 初始化查詢參數 引入type typeScript保護避免輸入有少或是拼字錯誤
//const initialState: ProductParams 型別註記(Type Annotation) 要符合ProductParams 架構

//這裡算是定義初始查詢參數(state) 給前端RTK Query的發送request前的參數物件
const initialState : ProductParams = {
    pageNumber : 1,
    pageSize : 10,
    types : [], 
    brands : [],
    keyword : '',
    orderBy : 'name'
}

//建立Slice 管理商品查詢參數
export const catalogSlice = createSlice({
    name : 'catalogSlice', //store的名稱 action type的前綴
    initialState, //上方的狀態
    reducers : {  //改變state的方法
        // P1 當前的狀態值 P2觸發的動作資訊 裡面有type和payload兩個屬性 type是指哪個action catalogSlice/setPageNumber'
        // payload  dispatch時帶進來的值
        setPageNumber(state,action){
            state.pageNumber = action.payload;
            // 例如在其他元件使用 dispatch(setPageNumber(2)); dispatch裡面的資料 對應到payload
        },
        setPageSize(state,action){
            state.pageSize = action.payload;
        },
        setOrderBy(state,action){
            state.orderBy = action.payload;
            state.pageNumber = 1;
        },
        setTypes(state,action){
            state.types = action.payload;
            state.pageNumber = 1;
        },
        setBrands(state,action){
            state.brands = action.payload;
            state.pageNumber = 1;
        },
        setKeyword(state,action){
            state.keyword = action.payload;
            state.pageNumber = 1;
        },
        //重置參數
        resetParams(){
            return initialState;
        }
    }
});

//action export 
export const {setBrands,setTypes,setOrderBy,setPageNumber,setPageSize,setKeyword,resetParams} =   catalogSlice.actions;