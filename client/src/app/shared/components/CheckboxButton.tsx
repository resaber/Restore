import { FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { useEffect, useState } from 'react';

//自訂好型別保護
type Props = {
  items: string[]; //傳入的選項陣列['a','b']
  checked: string[]; //選取的 項目清單 可多選checkbox 也可空 代表一開始都沒被選取
  onChange: (items: string[]) => void; //勾選 取消勾選時 觸發的事件 外部更新state 父元件提供的call back fn
};

export default function CheckBoxButton({ items, checked, onChange }: Props) {
  //設定local state
  const [checkedItems, setCheckedItems] = useState(checked); //預設給 有勾選的選項陣列(外部參數傳過來的)

  // 主要是為了程式碼的可重複使用效率， 父層 state一改動 透過參數傳遞過來 就可以自動重新設定本地端的state
  useEffect(() => {
    setCheckedItems(checked);
  }, [checked]); //依賴陣列checked string array (外部的Redux state)代表這依賴陣列裡面的checked陣列一旦變動，這個影響副作用會影響到checkedItems陣列 local state

  //有個string 參數
  const handleToggle = (value: string) => {
    // 檢查 checkedItems 這個陣列 裡面有沒有包含目前點選的 value
    const updatedChecked = checkedItems?.includes(value)
      ? 
      // string array method 的方法filter 逐一檢查陣列的 每個string元素 只保留為true的元素
      // 篩選 所有item 不等於 value 的結果新陣列 指派給 updatedChecked
        checkedItems.filter((item) => item !== value)
      : // 沒有的話 加入勾選 將這個value加入陣列
        // ...拓展運算子，將陣列元素展開 再把value這個元素接在後面 組成一個新的陣列
        // 例如array = ['a','b'] value = 'c' , newArray =  [...array,value] =>   ['a','b','c']
        [...checkedItems, value];

    setCheckedItems(updatedChecked); //更新local state
    onChange(updatedChecked); //呼叫外部傳進來的onChange function 並把updateChecked 陣列傳出去 子元件負責加/取消勾選 並把結果傳給父元件符合官格的方法 例如Filter.tsx 的 onChange={(items : string[]) => dispatch(setBrands(items))} 
  };


  // UI呈現 並切換勾選狀態
  return (
    <FormGroup>
      {/* 把string[] 陣列傳進來 每個都是checkBox*/}
      {/* 代表這個陣列的每個子選項 */}
      {items.map((item) => (
        <FormControlLabel
          key={item}
          control={
            <Checkbox
              checked={checkedItems.includes(item)} //local state 陣列是否有包含這個選項 有的話勾選
              onChange={() => handleToggle(item)} //切換這個選項的勾選狀態 
              color="secondary"
              sx={{ py: 1, fontSize: 40 }}
            />
          }
          label={item}
        />
      ))}
    </FormGroup>
  );
}
