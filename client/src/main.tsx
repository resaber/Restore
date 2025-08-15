import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './app/layout/style.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import './styles/theme.css';
import './styles/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { RouterProvider } from 'react-router-dom';
// 🔸負責讓你的 React 應用程式支援前端路由功能（不同頁面）

import { router } from './app/routes/Routes.tsx';
// 🔸自定義的 router 設定檔（包含 route 配置，例如 /about -> AboutPage）

import { Provider } from 'react-redux';
import { store } from './app/store/store.ts';
// 🔸Redux 提供的元件，讓 Redux store 能被整個 App 使用




createRoot(document.getElementById('root')!).render(
  <StrictMode>
     {/* 讓整個 App 都能使用 Redux store */}
    <Provider store={store}>
       <RouterProvider router={router} />
      {/* 提供路由功能，會根據網址切換不同元件 */}
    </Provider>
  </StrictMode>
);
