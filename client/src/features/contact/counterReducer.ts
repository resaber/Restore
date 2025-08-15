import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
// 🔸定義 state 的型別（TypeScript 專用）
// 說明整個 state 的結構，目前只包含一個名為 data 的數字屬性
export type CounterState = {
  data: number;
};

// 設定 state 的初始值（Redux store 一開始的狀態）
// 當 reducer 沒有收到任何 state 時，會使用這個 initialState
const initialState: CounterState = {
  data: 42, // 預設值為 42（例如：計數器初始值）
};


//改良的用法 tool kit 切片用法 createSlice 一次把action和 reducer(state變化) 統合再一起
export const counterSlice = createSlice({
  name: 'counter', // // 是 action 的前綴（例如 counter/increment）
  initialState, // 我們剛剛定義的初始狀態

  // reducers 是一組方法，負責描述「如何改變 state」
  // Toolkit 幫你自動建立 action 物件，不用自己手動寫 type 和 payload
  reducers: {
    increment: (state, action:PayloadAction<number>) => {
      // 在 Toolkit 中，你可以直接修改 state（看起來像可變）
      // 實際上 Toolkit 底層用 Immer.js 幫你產生不可變的新版 state
      state.data += action.payload;
    },
    decrement: (state, action:PayloadAction<number>) => {
      // 在 Toolkit 中，你可以直接修改 state（看起來像可變）
      // 實際上 Toolkit 底層用 Immer.js 幫你產生不可變的新版 state
      state.data -= action.payload;
    },
  },
});

//匯出動作函式
export const{increment,decrement} = counterSlice.actions;

// 匯出新版 reducer（推薦使用）
export const toolkitReducer = counterSlice.reducer;

// 留一個 export default，通常是推薦用的那個
export default toolkitReducer;

// 支援兩種動作，一個是 increment 表示加一，另一個是 decrement 表示減一
// type CounterAction = { type: 'increment' } | { type: 'decrement' };

// 定義 reducer 函式（目前尚未根據任何 action 做處理）
// 傳入目前的 state，回傳 state 本身（目前尚無邏輯處理）

// 若未來要支援 dispatch action，就會在這裡加入 switch-case 判斷
// : CounterState 限定這個函式的「回傳值型別」必須是 CounterState，也就是必須是數字形式的
// 限定這個 reducer 執行完之後 return 的值，必須是 { data: 數字 } 的物件結構

export function incrementLegacy(amount = 1) {
  return {
    type: 'increment',
    payload: amount,
  };
}

export function decrementLegacy(amount = 1) {
  return {
    type: 'decrement',
    payload: amount,
  };
}

export  function counterReducer(
  state = initialState,
  action: { type: string; payload: number }
) {
  switch (action.type) {
    case 'increment':
      return { ...state, data: state.data + action.payload }; //
    case 'decrement':
      return { ...state, data: state.data - action.payload }; //
    default:
      return state; // 若 action 不支援，回傳原樣（保持不變）
  }
}
