import { NavLink } from 'react-router-dom'; // React Router 中用來建立導覽連結的元件（具備 active 狀態）
import 'bootstrap-icons/font/bootstrap-icons.css'; // 引入 Bootstrap Icons 樣式（讓 bi-... 的圖示能顯示）
import IconButton from '@mui/material/IconButton';
import { Badge, useTheme, type Theme } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';

// 導覽列中間的連結（常見主頁連結）
const midLinks = [
  { title: '餐點類別', path: '/catalog' },
  { title: '關於店家', path: '/about' },
  { title: '聯絡我們', path: '/contact' },
];

// 導覽列右側連結（登入/註冊）
const rightLinks = [
  { title: '登入', path: '/login' },
  { title: '註冊', path: '/register' },
];


// 傳進來的 props 類型定義
type NavBarProps = {
  darkMode: boolean; // 當前是否為深色模式
  toggleDarkMode: () => void; // 切換主題的函式
};

export default function NavBar({ darkMode, toggleDarkMode }: NavBarProps) {
  const theme: Theme = useTheme(); // ✅ 明確指定型別為 Theme

  // 當 NavLink 與目前網址匹配時會套用 activeClass


  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark fixed-top bg-dark"
      id="cat-navbar"
    >
      <div className="container-fluid">
        {/* Logo + 主題切換按鈕（點擊時會呼叫 toggleDarkMode） */}
        <NavLink
          className="navbar-brand fw-bold d-flex align-items-center gap-2"
          to="/"
        >
          🐾 貓咪咖啡廳
          <button
            className="btn btn-md p-1"
            style={{
              backgroundColor: darkMode ? 'transparent' : 'black',
            }}
            onClick={toggleDarkMode}
            title="切換主題"
          >
            <i
              className={darkMode ? 'bi bi-moon-fill' : 'bi bi-sun-fill'}
              style={!darkMode ? { color: 'orange' } : {}}
            ></i>
          </button>
        </NavLink>

        {/* 漢堡按鈕（手機版展開收合導覽列用） */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="切換導航"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* 導覽列項目容器（展開/收合內容） */}
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          {/* 中間導覽連結區塊  把元素往左貼 margin-end: auto 中間置中 flex-grow-1 吃掉全部空間*/}
          <ul className="navbar-nav   flex-grow-1 justify-content-center gap-4">
            {/* 用 midLinks 生成導覽列項目 */}
            {midLinks.map(({ title, path }) => (
              <li className="nav-item" key={path}>
                {/* NavLink：React Router 導覽用，可根據當前路徑套用 active 樣式 */}
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    isActive ? 'nav-link-custom active' : 'nav-link-custom'
                  }
                >
                  {title.toUpperCase()}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* 右側 購物車+登入/註冊連結 */}
          <ul className="navbar-nav ms-auto justify-content-center align-items-center gap-3">
            <li className="nav-item me-2">
              {/* 新增：MUI 購物車按鈕 + 數量徽章 ~~bs5要套用我還真的沒辦法 */}
              <IconButton
                size="medium"
                sx={{
                  backgroundColor: theme.palette.warning.light, // 橘色背景
                }}
              >
                <Badge badgeContent="4" color="secondary">
                  <ShoppingCart></ShoppingCart>
                </Badge>
              </IconButton>
            </li>

            {rightLinks.map(({ title, path }) => (
              <li className="nav-item" key={path}>
                <NavLink
                  to={path}
                  key={path}
                  className={({ isActive }) =>
                    isActive ? 'nav-link-custom active' : 'nav-link-custom'
                  }
                >
                  {title.toUpperCase()}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
