import { useForm } from "react-hook-form";
import { useRegisterMutation } from "./accountApi"
import { registerSchema, type RegisterSchema } from "../../lib/schemas/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { LockOutlined } from "@mui/icons-material";
import { Paper, Typography, TextField, Button, Container, Box } from "@mui/material";

import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/store/store";


export default function RegisterForm() {
    //拿slice darkMode state
    const {darkMode} = useAppSelector(state => state.ui);

    //Post RTk Query mutation 陣列解構 拿P1 ftn 本體
    const [registerUser] = useRegisterMutation(); 
    //RHF 本體 套用zod驗證機制 再加上RHF-zod橋梁 zodResolver

    //react-hook-form RHF 套用zod驗證 需要在<>內加上型別參數 
    // useForm<RegisterSchema> : 泛型（TypeScript 型別標註）
    //   → 告訴 RHF 表單的資料結構必須符合 RegisterSchema
    //   → 這樣在開發時有型別安全（IDE 自動提示欄位名稱/型別） 開發好用的


    // register : 綁定到 <input> 元件，讓 RHF 能追蹤欄位值
    // handleSubmit : 包裝 onSubmit，確保送出前會先做驗證
    // formState.errors : 型別FieldErrors 存放每個欄位的錯誤訊息 儲存驗證錯誤，Zod驗證不通過食 對應各欄位的錯誤訊息（如 errors.email?.message）
    // formState.isValid : 型別boolean 檢測表單目前是否通過所有驗證
    // formState.isLoading : 型別boolean 檢測表單目前是否正在執行
    // ser error 無法通過驗證時，給欄位底下顯示 所需的 錯誤訊息

    const { register, handleSubmit, setError ,formState: { errors,isValid,isLoading } } = useForm<RegisterSchema>({
        //驗證模式: 第一次接觸後移開欄位時 會進行驗證
        mode: 'onTouched',

        //run-time 實際驗證機制要符合registerSchema RHF-zod 橋梁
        // resolver : RHF 與 Zod 的橋樑
        //   → RHF 本身只會做 required 檢查
        //   → 加上 zodResolver(registerSchema) 才能使用 Zod 的格式驗證規則
        //   - 前端驗證部分 用 Zod 驗證格式與長度
       resolver:zodResolver(registerSchema)
    });

    const onSubmit = async (data:RegisterSchema) => {
        //對應ftn (P1) P1參數 要符合這個 歸額
        try{
          //Redux ActionResult
          // registerUser(data) : mutation 觸發方法 RTK Query 特有包裝後的 Promise<ActionResult>(裡面有payload, meta, error) , 裡面是一個包含payload 和 metadata 的 Promise-like物件
          // unwrap()會把它拆解成Promise 提取乾淨的 payload內容 等api執行完成傳回資料
          await registerUser(data).unwrap();
        }catch(error){

          //{  "message": "Password 必須包含大寫字母,Email 已被註冊"} 後端API給的json格式
          //後端API Identity 比對email 是否重複 password是否符合強度要求 
          //RHF setError() 顯示對應欄位

          //型別斷言Type Assertion 這個error物件會有一個 message屬性 value 是 string
          //但本質上這個Error物件 實際有.name .message .stack等屬性可以使用
          const apiError = error as {message : string}; // "Password 必須包含大寫字母, Email 已被註冊"
          //有有message json物件 和裡面每一個key 的value是 string
          if(apiError.message && typeof apiError.message === 'string')
          {
            //轉成陣列並用,分隔裡面 分成獨立的每個字串形式的元素 ["Password 必須包含大寫字母", "Email 已被註冊"]
            //json 裡面原本是 {message: "xxx , yyy"} 現在轉回陣列，並用,分開裡面的 轉成陣列 內有每個字串子元素 ["Password 必須包含大寫字母","Email 已被註冊"]
            const errorArray = apiError.message.split(','); 

            //依序處理這兩個元素 
            //針對不同欄位設定 不同錯誤訊息 後端傳來的API 應該會有UserName Email(前端Json給的 後端API雖然是選填的但我們有設定Dto 讓他等於UserName) Password
            errorArray.forEach(e => {
              //每個字串元素 錯誤內容如果含有特定名稱 在欄位底下貼上那段錯誤 字串的完整訊息
              if(e.includes('Password')){
                //設定給RHF password欄位  RHF規定 P2 物件格式必須包含message屬性 來UI顯示錯誤訊息內容 對應LoginForm 的 helperText
                // setError('password',{message: e})
                setError('password' , {message : "密碼必須是高強度"})
              }else if(e.includes('Email')){
                setError('email',{message : "帳號重複，請輸入新的Email"})
              }
            })
          }
        }
    }

    return (
       //直接往內包一層Paper MUI套件 寬度sm 600px
    <Container component={Paper} maxWidth="sm" sx={{ borderRadius: 3 }}>
      {/* 垂直排序 垂直置中 marginTop = "8" 對應bs5 mt-5 3rem : 48px {8} MUI 是' 8x8=64 px */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        marginTop="8"
      >
        {/* 40px material Icon  React元件*/}
        <LockOutlined sx={{ mt: 3, color: darkMode ? '#faf3e0' : '#000000', fontSize: 40 }} />
        {/* 標題 */}
        <Typography variant="h5">註冊</Typography>

        {/* 登入表單填寫區塊 */}
        <Box
          component="form"
          //表單提交時 react-hook-form 提供的函式
          //會先根據 Zod Schema 做前端欄位驗證
          //驗證失敗 => 自動將錯誤填入 formState.errors，對應欄位會顯示錯誤提示
          //驗證通過 => 呼叫onSubmit(data) data是已驗證的表單資料
          //提交後再進行後端驗證  Identity 比對帳號密碼
          onSubmit={handleSubmit(onSubmit)}
          width="100%"
          display="flex"
          flexDirection="column"
          // 彼此間距8x3 24 px
          gap={3}
          marginY={3}
        >
          {/* autoFocus畫面一進入就 聚焦在這個欄位 */}
          <TextField
            fullWidth
            label='帳號'
            autoFocus 
            //前端驗證 
            {...register('email')} // 將這個 input 欄位註冊到 RHF（react-hook-form）中，欄位名稱為 email required必填  驗證失敗時顯示特定訊息
            //error 等於顯示"紅框"樣式 依照右邊的boolean值 MUI TextField 元件屬性 錯誤樣式開關 紅框紅色標籤
            error={!!errors.email} //RHF formState.errors錯誤集合 email欄位驗證失敗時 errors.email會是 {type : 'required' , message: "帳號是必填欄位"} 一個!把物件轉換成boolean 並取反 所以是false 再加一個! 又反轉 true
            helperText={errors.email?.message} // 顯示錯誤文字內容(紅字) MUITextField 元件屬性 錯誤訊息文字區塊 (顯示在輸入框下方)
          />
          <TextField
            fullWidth
            label='密碼'
            type='password'
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message} 
          />
          {/* MUI variant contained屬性 hover 會變色 */}
          {/* 按鈕disabled避免重複登入 當登入API在執行中或是沒通過驗證 欄位沒填或是驗證錯誤 */}
          <Button disabled={isLoading || !isValid} variant="contained" type='submit' size="large">
            註冊
          </Button>
          {/* 文字置中 內容文字置中 */}
          <Typography sx={{textAlign: 'center' }}>
            已經有帳號?
            {/* 導向特定路由 */}
            {/* 外距左邊16px */}
            <Typography sx={{ ml: 2 }} component={Link} to='/login' color='primary'>
              登入
            </Typography>
          </Typography>

        </Box>
      </Box>
    </Container>
    )
}