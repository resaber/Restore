import { useState } from 'react';
import NavBar from './NavBar';
import '../../styles/App.css';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { Outlet } from 'react-router-dom';
// import NavBarBs5 from './NavBarBs5';

//設定localStorage key 儲存背景 色彩模式設定
const getInitialDarkMode = () =>{
    // 從瀏覽器 localStorage 拿 key 對應的 value（字串形式）
  const storedDarkMode = localStorage.getItem('darkMode');
  // 如果有設定過，就用 JSON.parse 轉成布林值 true / false
  // 如果沒設定過（第一次使用），預設回傳 true（啟用 dark mode）
  //return value 如果瀏覽器一開始載入 沒設定的情況下 預設給true 從前端json value轉換成 可以用的js物件
  //相反是JSON.stringfy(true) js物件轉換成網頁的json
  return storedDarkMode ? JSON.parse(storedDarkMode) : true;
}


function App() {

  //用瀏覽器傳過來的 json轉換後的 js value 做判斷 這裡會是true or false
  const [darkMode, setDarkMode] = useState(getInitialDarkMode());
  // 根據 darkMode 值轉成 MUI 能識別的主題字串（light / dark）
  const paletteType = darkMode ? 'dark' : 'light';

  // 建立 MUI 主題，根據模式設定背景色 createTheme元素? 利用裡面的palette屬性 mode 根據前面設定的paletteType做判斷
  //在設定background屬性 依照palleteType 給背景顏色
  const darkTheme = createTheme({
    palette: {
      mode: paletteType,
      background: {
        default:paletteType === 'light' ? '#eaeaea' : '#121212',
      },
    },
  });

  // products.forEach((item, index) => {
  //   console.log({ index, ...item });
  // });


  const toggleDarkMode = () => {
    //把處理的js 結果 轉換成json重新設定回localStorage 切換成true>false false>true傳回前端瀏覽器
    //而我們自己本身的state也做反轉boolean
    localStorage.setItem('darkMode',JSON.stringify(!darkMode));
    setDarkMode(!darkMode);
    
}

  return (
    <>
      {/* <ThemeProvider>：將 darkTheme 套用到整個 App。 */}
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <NavBar
          darkMode={darkMode} // 傳布林值進去
          toggleDarkMode={toggleDarkMode} // 傳一個函式進去 />
        />
        <div
          className={`custom-background min-vh-100  ${
            darkMode ? '' : 'light-mode'
          }`}
        >
          <div className="container-fluid py-3">
            <Outlet />
          </div>
        </div>
      </ThemeProvider>
    </>
  );
}

export default App;
