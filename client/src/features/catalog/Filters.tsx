import { Box, Paper} from '@mui/material';
import Search from './Search';
import RadioButtonGroup from '../../app/shared/components/RadioButtonGroup';
import { useAppDispatch, useAppSelector } from '../../app/store/store';
import { resetParams, setBrands, setOrderBy, setTypes } from './catalogSlice';
import CheckBoxButton from '../../app/shared/components/CheckboxButton';

//Radio或是Select元件中
const sortOptions = [
  //value要和傳給後端的排序參數值一致
  { value: 'name', label: '依照名稱顯示' },
  { value: 'priceDesc', label: '價錢高到低' },
  { value: 'price', label: '價錢低到高' },
];

type Props = {
  filtersData: {
    brands: string[];
    types: string[];
  };
};

//解構 Catalog.tsx傳進來的參數叫做filtersData 這邊再把他轉成data 給程式碼使用 Catalog.tsx(filterData)>Filters.tsx(filterData)>Filter.tsx(data)
//{filtersData:data} 接受參數的同時也將這個參數重新命名， 名稱不見得要和父元素一樣，但資料格式必須一致
export default function Filters({filtersData:data}:Props) {
  //catalog Slice  types brands 空陣列 orderBy 預設 string "name"
  const { orderBy, types, brands } = useAppSelector((state) => state.catalog);
  const dispatch = useAppDispatch();



  console.log(data);
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      {/* 搜尋欄 */}
      <div className="card p-3">
        <Search />
      </div>
      {/* 排序方式 radio 區塊bs5 */}
      <div className="card p-3  shadow">
        <RadioButtonGroup
          selectedValue={orderBy} //catalog Slice 裡面的state
          options={sortOptions} //排序選項
          // 當 radio 被選取時，觸發 onChange：
          // 1. 透過 dispatch(setOrderBy(...)) 更新 catalog slice 中的 orderBy 狀態
          // 2. 由於 orderBy 是 useFetchProductsQuery 的依賴參數之一（productParams）
          // → RTK Query 會自動偵測參數改變，重新向後端發送 API 請求
          // 3. 查詢結果更新後，自動重新渲染 catalog.tsx 商品列表
          onChange={(e) => dispatch(setOrderBy(e.target.value))} // 更新catalog Slice orderBy State > 偵測參數改變 RTK Query useFetchProductsQuery(productParams)
        />
      </div>
      {/* 品牌brand 篩選 checkBox Button 載入catalogApi Query Slice 和 catalog Slice拿到的資料 裡面有*/}
      <Paper sx={{ p: 3 }}>
        <CheckBoxButton
          items={data.brands}
          checked={brands} //兩邊都是string[]
          //dispatch(...) 送出去的是一個action物件 哪個reducer要處理 裡面有兩個屬性 1.type : 實際執行的reducer位置  "type": "catalogSlice/setBrands"  name + reducer 名稱
          //第二個是payload 要更新那個state裡面的值   "payload": ["Nike"]

          onChange={(items: string[]) => dispatch(setBrands(items))} //符合子元件 函式規格 void且有一個string[]參數 執行內容為 (setBrands(items)) 更新catalog Slice 外部state 之後會連帶RTK query useFetchProductsQuery(productParams) 偵測到參數內容發生變化，連帶重新發送Api
        />
      </Paper>
      {/* 種類type篩選 checkBox Button 載入catalogApi Query Slice 和 catalog Slice拿到的資料 裡面有**/}
      <Paper sx={{ p: 3 }}>
        <CheckBoxButton
          items={data.types} //catalogApi Slice Query拿到的 API拿到所有可選的資料 靜態項目 通過特定API ProductController Distinct取得的所有可選項目 不會變動
          checked={types} //兩邊都是string[] 傳入types string[]  catalog Slice拿到的 使用者目前選取的項目 查詢參數的其中之一  RTK Q useFetchProductsQuery(params) ()內的查詢參數，如果參數有變化會發送新的API請求
          onChange={(items: string[]) => dispatch(setTypes(items))} //符合子元件 函式規格 void且有一個string[]參數 執行內容為 (setTypes(items)) 更新catalog Slice 外部state 之後會連帶RTK query useFetchProductsQuery(productParams) 偵測到參數內容發生變化，連帶重新發送Api
        />
      </Paper>
      {/* 重新初始化參數  */}
      <button
        type="button"
        className="btn btn-outline-secondary "
        onClick={() => dispatch(resetParams())}
      >
        {/* bs icon */}
        <i className="bi bi-arrow-counterclockwise me-2"></i> 重置篩選條件
      </button>
    </Box>
  );
}
