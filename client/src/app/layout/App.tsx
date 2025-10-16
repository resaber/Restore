import '../../styles/App.css';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import { useAppSelector } from '../store/store';

import NavBar from './NavBar';
import { useEffect } from 'react';
// import NavBarBs5 from './NavBarBs5';

function App() {
  //第一種寫法App 先去抓store.ts 在傳入到NavBar參數 NavBar有對應的type
  //使用useDispatch 把store.ts 裡面註冊的slice中的action 使用出來 例如這裡的被景色
  // const dispatch = useAppDispatch();
  // //同樣用 useAppSelector 把store.ts 裡面註冊為ui slice中的state darkMode使用出來
  const {darkMode} = useAppSelector((state) => state.ui);
  
  //local Storage 第一次載入 darkMode狀態改變 同步localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // 建立主題 從外部state boolean 來顯示字串  
  // 根據 darkMode 值轉成 MUI 能識別的主題字串（light / dark） 第一次載入是true 所以是dark模式
  const paletteType = darkMode ? 'dark' : 'light';

  // 建立 MUI 主題，根據模式設定背景色 createTheme元素? 利用裡面的palette屬性 mode 根據前面設定的paletteType做判斷
  // 在設定background屬性  createTheme 給背景顏色 darkTheme MUI屬性給的 有mode屬性 右邊會依照切換按鈕太陽的狀態 給予 黑色(因為預設true是黑色) 或是 白色
  const darkTheme = createTheme({
    palette: {
      //預設顯示暗色 背景
      mode: paletteType
    },
  });

  // products.forEach((item, index) => {
  //   console.log({ index, ...item });
  // });

  return (
    <>
      {/* <ThemeProvider>：將 darkTheme 套用到整個 App。 卡片 或是篩選區塊 會隨著太陽按鈕 切會黑白*/}
      <ThemeProvider theme={darkTheme}>
        {/* React Router dom 切換路由時 回到剛剛滾動停留的位置 */}
        <ScrollRestoration /> 
        <CssBaseline />
        {/* remove prop of NavBar component */}
        <NavBar />
        <div
        // 最小高度為100% viewport 根據darkMode boolean狀態 className為custom-background min-vh-100 或是 custom-background min-vh-100 light-mode
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
