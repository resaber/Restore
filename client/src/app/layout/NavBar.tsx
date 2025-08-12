
import "bootstrap-icons/font/bootstrap-icons.css";

type NavBarProps = {
    darkMode : boolean;
    toggleDarkMode : () => void;
}

export default function NavBar({darkMode,toggleDarkMode} : NavBarProps) {


  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top" id="cat-navbar">
      <div className="container-fluid">
        {/* 品牌名稱與主題 icon 放一起 */}
        <a className="navbar-brand fw-bold d-flex align-items-center gap-2" href="#">
          🐾 貓咪咖啡廳
          <button
            className="btn btn-md  p-1 "
            style={{backgroundColor: darkMode ? "transparent" : "black"}} // 切換時改背景
            onClick={toggleDarkMode}
            title="切換主題"
          >
            <i
              className={darkMode ? "bi bi-moon-fill" : "bi bi-sun-fill"}
              style={!darkMode ? { color: "orange" } : {}}
            ></i>
          </button>
        </a>

        {/* 漢堡按鈕 */}
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

        {/* 導覽連結 */}
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">首頁</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">餐點菜單</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">店內貓咪</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">預約</a>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                關於我們
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><a className="dropdown-item" href="#">品牌故事</a></li>
                <li><a className="dropdown-item" href="#">聯絡我們</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item" href="#">位置資訊</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
