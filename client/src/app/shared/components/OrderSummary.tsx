import { Box, Typography, Divider, Button, TextField, Paper } from "@mui/material";
import { currencyFormate } from "../../../lib/util";
import { useFetchBasketQuery } from "../../../features/basket/basketApi";
import type { Item } from "../../models/basket";
import { Link } from "react-router-dom";

//計算加總 的邏輯 結算邏輯和優惠碼
export default function OrderSummary() {
    const {data:basket} = useFetchBasketQuery();
    //單項金額  basket? 允許 購物車為undefined 
    // ?? 是判斷reduce的結果
    const subtotal = basket?.items.reduce((sum:number , item : Item) => sum + item.price * item.quantity , 0) ?? 0;
    //設定運費標準比如>100 免運
    const deliveryFee = subtotal > 10000 ? 0 : 500;

    return (
        <Box display="flex" flexDirection="column" alignItems="center" maxWidth="lg" mx="auto">
            {/* MUI white-bg */}
            <Paper sx={{ mb: 2, p: 3, width: '100%', borderRadius: 3 }}>

                <Typography variant="h6" component="p" fontWeight="bold">
                   訂單摘要
                </Typography>
                <Typography variant="body2" sx={{fontStyle: 'italic'}}>
                    消費滿 $100 即可享免運優惠!
                </Typography>
                <Box mt={2}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography color="textSecondary">小計</Typography>
                        <Typography>
                            {currencyFormate(subtotal)}
                        </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography color="textSecondary">折扣</Typography>
                        <Typography color="success">
                            {/* TODO */}
                            -$0.00
                        </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography color="textSecondary">運費</Typography>
                        <Typography>
                            {currencyFormate(deliveryFee)}
                        </Typography>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography color="textSecondary">總金額</Typography>
                        <Typography>
                            {currencyFormate(subtotal + deliveryFee)}
                        </Typography>
                    </Box>
                </Box>

                <Box mt={2}>
                    <Button
                        component = {Link}
                        //路由守衛
                        //組件 已登入的話 會返回Outlet 並渲染 內部的子組件 CheckoutPage 沒登入的話 導向登入頁面 並將/checkout 作為state location.pathname傳遞過去
                        to = '/checkout' //前往結帳頁面  /checkout 嵌套在Routes組件內的 <RequireAuth /> 的 children 裡，React Router 會首先渲染 <RequireAuth /> 組件。
                        size= 'large'
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mb: 1 }}
                    >
                        結帳
                    </Button>
                    <Button
                        component = {Link}
                        to = '/catalog' // 前往商品列表
                        fullWidth
                    >
                        繼續購物
                    </Button>
                </Box>
            </Paper>

            {/* Coupon Code Section */}
            <Paper sx={{ width: '100%', borderRadius: 3, p: 3 }}>

                <form>
                    <Typography variant="subtitle1" component="label">
                        有優惠碼嗎？
                    </Typography>

                    <TextField
                        label="Voucher code"
                        variant="outlined"
                        fullWidth
                        sx={{ my: 2 }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                    >
                        套用優惠碼
                    </Button>
                </form>
            </Paper>
        </Box>
    )
}