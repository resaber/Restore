import { Button, Menu, Fade, MenuItem, ListItemIcon, ListItemText, Divider } from "@mui/material";
import { useState } from "react";
import type { User } from "../models/user";
import { History, Logout, Person } from "@mui/icons-material";
import { useLogoutMutation } from "../../features/account/accountApi";
import { router } from "../routes/Routes";


//設定要傳進來的參數格式  要符合特定type User
type Props = {
    user : User
}

//進來User
export default function UserMenu({user}:Props) {

  const [logout] = useLogoutMutation(); //陣列解構 代表只拿trigger func  
  //logout 也要unwrap把 function 轉為真正的 Promise物件
  const handleLogout =async() =>{
    handleClose(); //對標先關閉下拉選單 在處理路由 避免UI跑掉
    try{
      await logout().unwrap(); //沒有參數 直接把這個function轉換為Promise物件 並等待執行完成
      //讓標籤失效 使快取失效
      router.navigate('/'); //導向首頁
    }catch(error){
      console.error('登出失敗',error);
    }
  }
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); //選單state menu <null(沒打開) 或是 html元素要掛在哪個按鈕或元素上>
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      
      <Button
        // 右側 登入後的email style 設定
        onClick={handleClick}
        size="large"
        sx={{fontSize: '16px' ,
            backgroundColor: '#fdf0d5',
            color: '#000000',
            '&:hover':{
              backgroundColor:'#90e0ef',
            }
         }}
      >
        {/* 顯示使用者email文字到button上 */}
        {user.email}
      </Button>
      <Menu
        id="fade-menu"
        slotProps={{
          list: {
            'aria-labelledby': 'fade-button',
          },
        }}
        slots={{ transition: Fade }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {/* display flex , align-item : center 垂直置中*/}
        <MenuItem>
        {/* 給個icon和文字內容 */}
            <ListItemIcon>
                {/* MUI icon */}
                <Person/>
            </ListItemIcon>
            <ListItemText>我的帳號</ListItemText>
        </MenuItem>
          <MenuItem>
        {/* 給個icon和文字內容 */}
            <ListItemIcon>
                {/* Mui Icon */}
                <History/>
            </ListItemIcon>
            <ListItemText>我的訂單</ListItemText>
        </MenuItem>
        
        <Divider/>
        {/* 添加登出功能 mutation過來的*/}
           <MenuItem onClick={handleLogout}>
        {/* 給個icon和文字內容 */}
            <ListItemIcon>
                {/* Mui Icon */}
                <Logout color="primary"/>
            </ListItemIcon>
            <ListItemText>登出</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
}