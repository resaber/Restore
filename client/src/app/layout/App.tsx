import { useEffect, useState } from 'react';
import type { Product } from '../models/product';
import Catalog from '../../features/catalog/Catalog';
import NavBar from './NavBar';
import '../../styles/App.css';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
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

  useEffect(() => {
    fetch('https://localhost:5001/api/product')
      .then((response) => response.json())
      .then((data) => setProducts(data));
  }, []);

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
            <Catalog products={products} />
          </div>
        </div>
      </ThemeProvider>
    </>
  );
}

export default App;
