import {z} from "zod"; //zod套件匯出得一個物件 可以使用驗證方法.string() .number() ......  官方文件預設寫法
//導入zod套件驗證機制 可以直接再 RHF 登入表單 輸入錯誤時驗證提示 對應兩個屬性 前端給的是email、password json 後端API 傳送的時候適用UserName Password
export const loginSchema = z.object({
    //validate email 為string格式 且是email 
    email: z.string().email(),
    password: z.string().min(6,{
        message: '密碼長度必須至少大於6位數'
    })
});

//透過 z.infer 自動產出該 schema 對應的 TypeScript 型別 導出type給組件使用 強型別
export type LoginSchema = z.infer<typeof loginSchema>;