import type { ChangeEvent } from 'react';

//自訂傳入的參數規格
type Props = {
  options: { value: string; label: string }[]; //Array型別的 由多個物件(元素)組成  的一個陣列裡面包含例如 [{value:'price',label:'價格低到高'}, { value: 'priceDesc', label: '價格高到低' },]
  //React 的 ChangeEvent（作用在 <input>、<select> 等元素）

  //    onChange是一個涵式型別，元件綁定時會收到一個event物件 這個函式 會在HTMLInputElement 或是 HTMLSelectElement 元素發生變化時（如 value 改變）被觸發
  //    React 會呼叫你綁定的 onChange 函式，並傳入一個 event 物件，且沒有回傳值
  //    這個 event 的 target 就是觸發事件的那個 <input> 或是 <select>元素（也就是事件來源）
  //    可以透過 event.target.value、event.target.name 等方式，去讀取或操作該元素的屬性值。
  //    HTMLInputElement：這裡表示綁定的是 <input> 元素 event 是 React 提供的 變化事件（ChangeEvent），而且特別指定是作用在 <input> HTML 元素上的事件

  //    event.target 推斷為 HTMLInputElement，
  //     你只能使用這個元素實際上有的屬性，不會是any(甚麼屬性都出現)
  //    每個屬性都會有正確的型別提示
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;

  //選擇的value
  selectedValue: string;
};

//指定 外部元件 要使用這個元件(RadioButtonGroup)所需傳遞的三個參數
export default function RadioButtonGroup({
  options,
  onChange,
  selectedValue,
}: Props) {
  return (
    <>
      <label className="form-label">排序方式</label>
      <div>
        {/* 生成多個radio 並用options 這陣列內 每個元素(物件)的屬性 產生radio*/}
        {options.map(({ value, label }) => (
            //radio checkBox 容器 bs5 寫法 form-check = radioGroup(MUI) 實際上大概會是key="price-價格低到高"
          <div className="form-check" key= {`${value}-${label}`}>
            <input
              //每個單選都是radio input : form-check-input
              className=" form-check-input"
              type="radio"
              name="sortOptions" //所有radio共享相同的name 代表互斥只能單選
              id={`sort-${value}`} //htmlFor 的值應該對應某個 input 的 id 這樣點選label文字 就會自動勾選對應的input
              value={value} //實際給後端的value
              // Controlled Component（受控元件）寫法 :
              //   <input type="radio" checked={...條件表達式...} /> checked 是一個boolean值
              // 簡單說這裡就是判斷 傳進來的 這個參數 有沒有等於本身這個radio單選 的value 一致就是true就會勾選 不同就是false 不選取
              // React綁定屬性 來設定有沒有選取的方式 
              checked = {selectedValue === value} // 設定當前被選中的項目
              onChange={onChange} //綁定變化事件 當input 元素值改變時，會呼叫綁定的 onChange 函式，並自動傳入對應的事件物件，要怎麼使用由父元件(使用這component)決定怎麼處理
     
            />
            {/* 導入label 文字顯示名稱 */}
            <label className="form-check-label" htmlFor={`sort-${value}`}>
              {label}
            </label>
          </div>
        ))}
      </div>
    </>
  );
}
