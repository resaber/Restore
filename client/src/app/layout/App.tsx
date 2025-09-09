import '../../styles/App.css';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import { useAppSelector } from '../store/store';

import NavBar from './NavBar';
// import NavBarBs5 from './NavBarBs5';

function App() {
  //第一種寫法App 先去抓store.ts 在傳入到NavBar參數 NavBar有對應的type
  //使用useDispatch 把store.ts 裡面註冊的slice中的action 使用出來 例如這裡的被景色
  // const dispatch = useAppDispatch();
  // //同樣用 useAppSelector 把store.ts 裡面註冊為ui slice中的state darkMode使用出來
  const {darkMode} = useAppSelector((state) => state.ui);

  // 建立主題
  // 根據 darkMode 值轉成 MUI 能識別的主題字串（light / dark）
  const paletteType = darkMode ? 'dark' : 'light';

  // 建立 MUI 主題，根據模式設定背景色 createTheme元素? 利用裡面的palette屬性 mode 根據前面設定的paletteType做判斷
  // 在設定background屬性 依照palleteType 給背景顏色
  const darkTheme = createTheme({
    palette: {
      mode: paletteType,
      background: {
        default: paletteType === 'light' ? '#eaeaea' : '#eaeaea',
      },
    },
  });

  // products.forEach((item, index) => {
  //   console.log({ index, ...item });
  // });

  return (
    <>
      {/* <ThemeProvider>：將 darkTheme 套用到整個 App。 */}
      <ThemeProvider theme={darkTheme}>
        {/* React Router dom 切換路由時 回到剛剛滾動停留的位置 */}
        <ScrollRestoration /> 
        <CssBaseline />
        {/* remove prop of NavBar component */}
        <NavBar />
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
