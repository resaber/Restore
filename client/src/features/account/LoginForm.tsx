import { LockOutlined } from '@mui/icons-material';
import { Box, Button, Container, Paper, TextField, Typography } from '@mui/material';
import {  Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form' //RHF
import {  loginSchema, type LoginSchema } from '../../lib/schemas/loginSchema';
import { useAppSelector } from '../../app/store/store';
import {zodResolver} from "@hookform/resolvers/zod" //RHF 和Zod 驗證之間的中介 可以用Zod驗證資料
import { useLazyUserInfoQuery, useLoginMutation} from './accountApi';


// 登入視窗畫面組件
export default function LoginForm() {
 
  const[login, {isLoading}] = useLoginMutation(); // P1 trigger function P2 isLoading是否正在載入中，底下按鈕 可以根據這個狀態，來顯示isLoading畫面或防止重複提交 const[func,result]
  //RTK 拿快取 ftn 只有在API登入成功後 才手動更新快取
  const[fetchUserInfo] = useLazyUserInfoQuery();
  
  // react router dom 存入當前位置屬性
  const location = useLocation();
  const {darkMode} = useAppSelector((state) => state.ui);
  //react-hook-form RHF 套用zod驗證 需要在<>內加上型別參數 
  //useForm<LoginSchema>() : 泛型指定表單欄位的型別（來自 zod 驗證後推導出的 LoginSchema）前端給的json 屬性要有email password 屬性
  //register:用來綁定input欄位 useForm 追蹤欄位的值
  //handleSubmit : 包裝 onSubmit，確保在呼叫前會進行驗證
  //formState.errors : 儲存驗證錯誤訊息，例如必填錯誤、格式錯誤等 例如 errors.email?.message


  //RHF zod驗證 
  const { register, handleSubmit, formState: { errors } } = useForm<LoginSchema>({
    mode:'onTouched', // 第一次接觸inputs欄位且移開欄位時，會驗證那個欄位
    //resolver是useForm裡面的一個屬性 指定要用哪個schema驗證器(zod) loginSchema : Zod 驗證規則物件（schema 本體）驗證規則 錯誤訊息內容
    //LoginSchema 是TS類型 資料應該長甚麼樣子 給程式碼做型別檢查用的
    resolver: zodResolver(loginSchema)
  });


 


  //React router 重新導向特定頁面 react router dom : hook from react router dom
  const navigate = useNavigate();

  //有個LoginSchema型別標註的參數 Type Annotation 參數要符合這個type架構 async 必須wait for response "async function" 對應登錄操作
  //async 方法 非同步等太function執行 
  const onSubmit =  async (data: LoginSchema) => {
    //如果驗證失敗 onSubmit函式不會觸發 由RHF 處理 data會是 { email: string, password: string } 結構 body會是RTK query 自動將參數物件轉換為json 並附加到request body

    try{
          await login(data).unwrap(); //RTK Query Mutation等待 Promise 完成，成功則返回 payload，失敗則拋出錯誤到 catch 區塊。
          await fetchUserInfo(); // 手動更新快取 抓看看使用者資訊

          //登入後 如果有「原本被攔截的頁面位置」（如 <RequireAuth>組件擋下時附帶的 /checkout），則跳轉回該頁  ， 否則預設跳轉至 /catalog 商品頁 
          //ts型別斷言 這個state 有包含一個可選的form屬性 且 屬性值是string '/checkout' || '/catalog'
     
          //找到form 那個string value 登入前是否被路由守衛攔截 某個頁面資訊 有的話則導航至那個攔截頁面 ('/checkout'結帳頁面) 沒有的話就是catalog頁面
          navigate((location.state as { form?: string })?.form || '/catalog');

    }catch(error){
      console.error('登入失敗',error);
    }
  }

  return (
    //直接往內包一層Paper MUI套件 寬度sm 600px 登入區塊  放到水平居中 顯示 
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
        <Typography variant="h5">登入</Typography>

        {/* 登入表單填寫區塊 */}
        <Box
          component="form"
          //表單提交時 react-hook-form 提供的函式 handleSubmit 通過RHF 驗證 並且使用onSubmit方法 這個方法自帶一個符合LoginSchema型別的參數(data)
          //先根據 Zod Schema 做驗證，通過後才執行 onSubmit這個方法(data)，驗證通過的資料組成一個data物件，失敗則自動更新 errors 狀態
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
            {...register('email')} // 將這個 input 欄位註冊到 RHF（react-hook-form）中，欄位名稱為 email required必填  驗證失敗時顯示特定訊息
            //error 等於顯示"紅框"樣式 依照右邊的boolean值 MUI TextField 元件屬性 錯誤樣式開關 紅框紅色標籤
            error={!!errors.email} //RHF formState.errors錯誤集合 email欄位驗證失敗時 errors.email會是 {type : 'required' , message: "帳號是必填欄位"} 一個!把物件轉換成boolean 並取反 所以是false 再加一個! 又反轉 true
            helperText={errors.email?.message} // 顯示錯誤文字內容(紅字) MUITextField 元件屬性 錯誤訊息文字區塊 (顯示在輸入框下方)
          />
          <TextField
            fullWidth
            label='密碼'
            type='password' //圓點顯示
            {...register('password')} //json 給 對應的 password屬性
            error={!!errors.password}
            helperText={errors.password?.message} //error message
          />
          {/* MUI variant contained 屬性 hover 會變色 type 提交 */}
          {/* 按鈕disabled避免重複登入 當登入API在執行中 */}
          <Button disabled={isLoading} variant="contained" type='submit' size="large">
            登入
          </Button>
          {/* 文字置中 內容文字置中 */}
          <Typography sx={{ textAlign: 'center' }}>
            沒有帳號?
            {/* 導向特定路由 */}
            {/* 外距左邊16px MUI 1: 8px*/}
            <Typography sx={{ ml: 2 }} component={Link} to='/register' color='primary'>
              註冊
            </Typography>
          </Typography>

        </Box>
      </Box>
    </Container>
  );
}
