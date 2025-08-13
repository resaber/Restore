import "bootstrap-icons/font/bootstrap-icons.css";

// 中間導覽連結
const midLinks = [
  { title: 'catalog', path: '/catalog' },
  { title: 'about', path: '/about' },
  { title: 'contact', path: '/contact' },
];

// 右側登入/註冊連結
const rightLinks = [
  { title: 'login', path: '/login' },
  { title: 'register', path: '/register' },
];

type NavBarProps = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};

export default function NavBar({ darkMode, toggleDarkMode }: NavBarProps) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top" id="cat-navbar">
      <div className="container-fluid">
        {/* 品牌名稱與主題切換按鈕 */}
        <a className="navbar-brand fw-bold d-flex align-items-center gap-2" href="/">
          🐾 貓咪咖啡廳
          <button
            className="btn btn-md p-1"
            style={{ backgroundColor: darkMode ? "transparent" : "black" }}
            onClick={toggleDarkMode}
            title="切換主題"
          >
            <i
              className={darkMode ? "bi bi-moon-fill" : "bi bi-sun-fill"}
              style={!darkMode ? { color: "orange" } : {}}
            ></i>
          </button>
        </a>

        {/* 漢堡按鈕（手機版展開導覽列） */}
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

        {/* 導覽列內容區域 */}
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          {/* 中間導覽列區塊 */}
          <ul className="navbar-nav me-auto">
            {midLinks.map(({ title, path }) => (
              <li className="nav-item" key={path}>
                <a className="nav-link text-white" href={path}>
                  {title.toUpperCase()}
                </a>
              </li>
            ))}
          </ul>

          {/* 右側登入/註冊連結 */}
          <ul className="navbar-nav">
            {rightLinks.map(({ title, path }) => (
              <li className="nav-item" key={path}>
                <a className="nav-link text-white" href={path}>
                  {title.toUpperCase()}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
