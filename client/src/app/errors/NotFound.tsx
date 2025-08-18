import { SearchOff } from '@mui/icons-material';

export default function NotFound() {
  return (
    <div className="card p-3 shadow-sm d-flex flex-column justify-content-center   align-items-center p-5">
      <SearchOff sx={{ fontSize: 100 }} color="primary">
        <h3 className="mb-3">找不到對應的資料頁面</h3>
      </SearchOff>
      {/* <!-- 按鈕 (全寬) --> */}
      {/* 回到商品頁面 */}
      <a href="/catalog" className="btn btn-primary w-100">
        Go back to shop
      </a>
    </div>
  );
}
