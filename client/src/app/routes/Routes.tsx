import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import Catalog from "../../features/catalog/Catalog";
import ProductDetails from "../../features/catalog/ProductDetails";
import AboutPage from "../../features/about/AboutPage";
import ContactPage from "../../features/contact/ContactPage";
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound";
import BasketPage from "../../features/basket/BasketPage";
import CheckoutPage from "../../features/checkout/CheckoutPage";
import LoginForm from "../../features/account/LoginForm";
import RegisterForm from "../../features/account/RegisterForm";
import RequireAuth from "./RequireAuth";

export const router = createBrowserRouter([
    {
        //起始路徑 對應其他組件 Link to '/' 或是 '/about'
        path: '/',
        element: <App />, //裡面有基本元件 例如上方 navbar 或是 下方footer
        //children顯示在App 組件裡面中間 的Outlet 位置
        children: [
            //首頁路由 這裡是相對路徑 所以不用+/ 因為都是接再
            //其他組件 如果某個連結 要用 <Link to = 'xxx'>MUI元件 導向特定路由 要加上"/" 表示從根路徑 絕對路徑出發去找 
            //對應到RequireAuth 組件 保護巢狀的結帳頁面 使用者未登入 會由組件內設定的導向login頁面 登入後 再從新導回'checkout頁面'
            
            //checkout 路由 會導入RequireAuth組件 有登入才能進入到Checkout Page 沒登入 導向 登入頁面
            {
               element: <RequireAuth />,children: [
                {path: 'checkout' , element: <CheckoutPage />}
               ]
            },
            { path: '', element: <HomePage /> },
            { path: 'Catalog', element: <Catalog /> },
            { path: 'Catalog/:id', element: <ProductDetails /> },
            { path: 'about', element: <AboutPage /> },
            { path: 'contact', element: <ContactPage /> },
            { path: 'basket', element: <BasketPage /> },
            { path: 'server-error', element: <ServerError /> },
            { path: 'login', element: <LoginForm /> },
            { path: 'register', element: <RegisterForm /> },
            { path: 'not-found', element: <NotFound /> },
            //輸入不存在的route 自動導向到/not-found
            { path: '*', element: <Navigate replace to='/not-found' /> }
        ]
    }
])