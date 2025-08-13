import { useState } from 'react';
import NavBar from './NavBar';
import '../../styles/App.css';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { Outlet } from 'react-router-dom';
// import NavBarBs5 from './NavBarBs5';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const palleteType = darkMode ? 'dark' : 'light';
  const darkTheme = createTheme({
    palette: {
      mode: palleteType,
      background: {
        default: palleteType === 'light' ? '#eaeaea' : '#121212',
      },
    },
  });

  // products.forEach((item, index) => {
  //   console.log({ index, ...item });
  // });
  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <NavBar
          darkMode={darkMode} // 傳布林值進去
          toggleDarkMode={() => setDarkMode(!darkMode)} // 傳一個函式進去 />
        />{' '}
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
