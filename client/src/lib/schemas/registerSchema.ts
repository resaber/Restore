

import {z} from "zod";
//驗證規格 Regular Expression Library網站找  微軟強型別驗證機制 正則表達式
const  passwordValidation = new RegExp(
    //至少1大寫 小寫 數字 特殊符號 長度介於6-10之間 正向前瞻?= 對整個輸入框內容進行判斷
    /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/
)

//註冊表單欄位 type規格設置 和zod 實際對註冊資料驗證 例如姓名 帳號內容 密碼長度 出生年月日 之類的
export const registerSchema = z.object({
    email: z.string().email(),
    //正則表達式 一大寫 一小寫 一特殊符號  P1 RegExp物件 P2 錯誤訊息 
    password: z.string().regex(passwordValidation,{
        message: '密碼須包含 1大寫 , 1小寫 , 1數字 , 1特殊符號 , 長度介於6-10之間'
    })
});
//導出type 給組件在compile時 使用 強型別輸入 對應loginSchema一樣
export type RegisterSchema = z.infer<typeof registerSchema>;
