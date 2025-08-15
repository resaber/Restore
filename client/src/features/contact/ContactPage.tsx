import { useAppDispatch, useAppSelector } from '../../app/store/store';
import {  decrement, increment } from './counterReducer';

export default function ContactPage() {
  // 使用 useSelector 從 Redux store 中讀取目前的 state
  // 並取出其中的 data 屬性作為目前顯示的數值
  // 對應到Redux state裡有一個叫 counter的區塊 這區塊的邏輯交給  counterSlice.reducer 處理

  //用store.ts 註冊的useAppSelector useAppDispatch 去抓reducer裡面的state裡面的 行為
  const {data} = useAppSelector(state => state.counter);
  const dispatch = useAppDispatch();



  return (
    <div className="text-center mt-4">
      <h2>聯繫頁面</h2>
      <h3>目前數值：{data}</h3>
      <div className=" btn-group me-2" role="group">
        <button
          className="btn btn-success me-2"
          onClick={() => dispatch(increment(3))}
        >
          +3
        </button>

        <button
          type="button"
          className="btn btn-danger"
          onClick={() =>dispatch(decrement(2))}
        >
          -2
        </button>
      </div>

      <button
        type="button"
        className="btn btn-outline-primary"
        onClick={() => dispatch(decrement(5))}
      >
        減少5
      </button>
    </div>
  );
}
