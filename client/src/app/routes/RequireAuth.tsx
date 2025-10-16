import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUserInfoQuery } from "../../features/account/accountApi"

export default function RequireAuth() {

    //RTK 快取 若有則使用原本的避免重複載入 降低API承載 若沒有發送新的API 建立快取 並設定data資料 redux store 快取
    const { data: user, isLoading } = useUserInfoQuery();

    //hook React Router : 取得目前頁面資訊 方便其他組件redirect 這個頁面
    const location = useLocation();

    //載入使用者資訊
    if(isLoading) return <div>正在載入中</div>

    //沒登入導向登入表單頁面 並把"目前的頁面位置" 存在state.form 裡面 登入後會重新導向回來
    //state 目前被攔截的頁面資訊儲存 在這裡 對應的LoginForm.location.state?.from (如果使用者 開/checkout頁面) routers.tsx 這組件有承載checkout
    //如果其他登入，例如直接按登入頁面 ('/logout') 登入顯示商品頁面 

    //state.from 對應Routes.tsx 組件設定的 path:'checkout'
    //傳遞 { from: '/checkout' }
    //UX體驗 技術心得 使用者其他組件登入後 倒回目前的網頁位置

    if(!user){
        return <Navigate to ='/login' state = {{form: location.pathname}} /> //state : {from: '/checkout'} 這個json物件 state.from 才是那個字串
    }

    //使用者已登入   請渲染定義在 RequireAuth 路由底下的那個『子路由』所對應的組件。 這邊就是RequireAuth 路由底下的 那個子路由('/checkout') Checkout組件
    return (
        <Outlet />
    )
}