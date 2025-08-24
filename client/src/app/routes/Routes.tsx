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

export const router = createBrowserRouter([
    {
        path:'/',
        element : <App />,
        children: [
            {path: '',element:<HomePage/>},
            {path: '/Catalog',element:<Catalog/>},
            {path: '/Catalog/:id',element:<ProductDetails/>},
            {path: '/about',element:<AboutPage/>},
            {path: '/contact',element:<ContactPage/>},
            {path: '/basket',element:<BasketPage/>},
            {path: '/checkout',element:<CheckoutPage/>},
            {path: '/server-error',element:<ServerError/>},
            {path: '/not-found',element:<NotFound />},
            //輸入不存在的route 自動導向到/not-found
            {path: '*',element: <Navigate replace to = '/not-found'/>}
        ]
    }
])