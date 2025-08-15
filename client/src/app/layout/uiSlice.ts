import { createSlice } from "@reduxjs/toolkit";


//設定localStorage key 儲存背景 色彩模式設定
const getInitialDarkMode = () =>{
    // 從瀏覽器 localStorage 拿 key 對應的 value（字串形式）
  const storedDarkMode = localStorage.getItem('darkMode');
  // 如果有設定過，就用 JSON.parse 轉成布林值 true / false
  // 如果沒設定過（第一次使用），預設回傳 true（啟用 dark mode）
  //return value 如果瀏覽器一開始載入 沒設定的情況下 預設給true 從前端json value轉換成 可以用的js物件
  //相反是JSON.stringfy(true) js物件轉換成網頁的json
  return storedDarkMode ? JSON.parse(storedDarkMode) : true;
}


export  const uiSlice  = createSlice({
    name:'ui',
    initialState : {
        isLoading : false,
        //新增一個state 接收的是getInitialDarkMode 這個localStorage裡面的key-value
        darkMode :getInitialDarkMode()
    },
    //實際的action
    reducers : {
        startLoading : (state) => {
            state.isLoading = true
        },
        stopLoading : (state) => {
            state.isLoading = false
        },
        toggleDarkMode : (state) => {
        //把處理的js 結果 轉換成json重新設定回localStorage 切換成true>false false>true傳回前端瀏覽器
        //而我們自己本身的state也做反轉boolean
        state.darkMode = !state.darkMode;
        //反向 把state裡面的boolean反轉設定回去
        localStorage.setItem('darkMode',JSON.stringify(!state.darkMode));
        }
    }

});
//導出action + toggleDarkMode
export const {startLoading,stopLoading,toggleDarkMode} = uiSlice.actions;