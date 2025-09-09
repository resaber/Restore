import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/store/store';
import { setKeyword } from './catalogSlice';
// import { debounce } from '@mui/material';

export default function Search() {
  //拿取state 裡面的Slice 裡面的屬性
  const { keyword } = useAppSelector((state) => state.catalog);

  //建立local state 檢測輸入欄 初始值用Redux store帶進來的keyword
  const [term, setTerm] = useState(keyword);
  //使用對應的action 改變state
  const dispatch = useAppDispatch();

  //1. 監聽Redux keyword 更新本地term
  //Redux store 的keyword state改變時 同步更新 local(本地端) state的term
  //例如reset 還原過濾條件
  useEffect(() => {
    setTerm(keyword);
  }, [keyword]);

  //2. useEffect 監聽本地 term → 延遲更新 Redux keyword（防抖）(Debounce)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(setKeyword(term)); //傳入本地端state過去 更新外部的state
    }, 500); // 延遲0.5秒 更新外部 catalogSlice裡面的 keyword state

    //React useEffect裡面的 return 不是用來回傳值 而是用來指定一段清除副作用的邏輯 清除上次的timeout > 避免觸發多餘的API請求 return
    return () => clearTimeout(timeoutId);
  }, [term, dispatch]); //[]依賴陣列，變動時執行這段useEffect

  //debounce MUI工具 簡單寫法 省略setTimeout 以及 return清除副作用
  //延遲0.5秒 將這個變動事件 變動內容的value 傳遞給store裡面的 dispatch 指定好特定的action(並給變動事件裡面的value)
  //   const debounceSearch = debounce((e : React.ChangeEvent<HTMLInputElement>) => {
  //     dispatch(setKeyword(e.target.value));
  //   },500);

  return (
    // 搜尋欄
    <>
      <label htmlFor="searchInput" className="form-label">
        搜尋商品
      </label>
      <input
        type="search"
        className="form-control"
        id="searchInput"
        placeholder="輸入商品名稱" //tip word
        value={term} //value 輸入框的內容綁定 本地端的 狀態
        // onChange={(e) => dispatch(setKeyword(e.target.value))} //dispatch 更新 Redux store action 更新 keyword state
        onChange={(e) => {
          setTerm(e.target.value); //更新本地端state 即時更新輸入欄位 不會馬上觸發API 也會更新useEffect的依賴陣列 等到dispatch store 裡面的keyword
          // 外部state會在0.5秒後改變，觸發query變動，重新發送API請求
          // debounceSearch(e); //延遲推送0.5秒 到Redux store更新catalogSlice 那邊的state ，連帶觸發useFetchProductsQuery(productParams)
        }}
      />
    </>
  );
}
