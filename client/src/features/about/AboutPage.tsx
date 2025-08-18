import { Alert, AlertTitle, Button } from '@mui/material';
import {
  useLazyGet400ErrorQuery,
  useLazyGet401ErrorQuery,
  useLazyGet404ErrorQuery,
  useLazyGet500ErrorQuery,
  useLazyGetValidationErrorQuery,
} from './errorApi';
import { useState } from 'react';

export default function AboutPage() {
  //宣告validationErrors state變數 型別是string[] 且初始值是空array []，setValidationErrors更新這個狀態的方法
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const [trigger400Error] = useLazyGet400ErrorQuery();
  const [trigger401Error] = useLazyGet401ErrorQuery();
  const [trigger404Error] = useLazyGet404ErrorQuery();
  const [trigger500Error] = useLazyGet500ErrorQuery();
  const [triggerValidationError] = useLazyGetValidationErrorQuery();

  // 自訂方法 error Array

  //if()裡面是ts型別保護 type guard
  const getValidationError = async () => {
    try {
      await triggerValidationError().unwrap();
    } catch (error: unknown) {
      if (
        //有error 物件 且 是物件型別 且 有message屬性 且「先假裝 error 裡有 message 屬性」 型別是string
        error &&
        typeof error === 'object' &&
        'message' in error &&
        //型別斷言+保護 一起用  Type Assertion + Type guard
        typeof (error as { message: unknown }).message === 'string'
      ) {
        //這裡就可以安全推斷error.message是字串 直接轉型成一維字串陣列
        const errorArray = (error as { message: string }).message.split(',');
        setValidationErrors(errorArray);
      }
    }
  };

  return (
    <div className="container my-4">
      <h3>錯誤測試按鈕</h3>
      <div className=" btn-group" role="group" aria-label="錯誤測試按鈕">
        <Button
          variant="contained"
          onClick={() => trigger400Error().catch((err) => console.log(err))}
        >
          Test 400 Error
        </Button>
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={() => trigger400Error()}
        >
          400
        </button>
        <button
          type="button"
          className="btn btn-outline-warning"
          onClick={() => trigger401Error().catch((err) => console.log(err))}
        >
          401
        </button>
        <button
          type="button"
          className="btn btn-outline-info"
          onClick={() => trigger404Error().catch((err) => console.log(err))}
        >
          404
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => trigger500Error().catch((err) => console.log(err))}
        >
          500
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          // onClick={() => triggerValidationError()
          //   .unWrap() //使用 unwrap 將原本包在 RTK Query 的結果物件「解開」，直接取得成功資料或丟出錯誤
          //   .catch((err) => console.log("錯誤訊息",err))}
          onClick={getValidationError}
        >
          驗證錯誤處理按鈕
        </button>
      </div>
 
      {/* 把這個state內容變數印出來 */}
      {validationErrors.length > 0 && (
        //MUI 元件
        <Alert severity="error">
          <AlertTitle>驗證error錯誤訊息內容</AlertTitle>
          <ul className=" list-group">
            {validationErrors.map((err) => (
              <li className='list-group-item border-0 bg-transparent px-0 py-1' key={err}>
                {err}
              </li>
            ))}
          </ul>
        </Alert>
      )}
    </div>
  );
}
