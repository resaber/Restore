import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Product } from '../../app/models/product';
import Grid2 from '@mui/material/Grid2';

export default function ProductDetails() {
  // ✅ 從 URL 取得參數 id，例如路徑是 /product/3，則 id = "3"
  const { id } = useParams();

  // ✅ 宣告一個狀態 product 來儲存 API 回傳的產品資料
  // 初始為 null，表示尚未載入資料
  const [product, setProduct] = useState<Product | null>(null);

  // ✅ useEffect：用來處理「副作用」，這裡是指從 API 取得資料
  useEffect(() => {
    // 🔁 每次 id 改變時（或元件第一次掛載），就執行 fetch 資料
    fetch(`https://localhost:5001/api/product/${id}`)
      .then((response) => response.json()) // ⚠️ 注意要呼叫 json() 函式
      .then((data) => setProduct(data)) // ✅ 將取得的資料放入 state（觸發 re-render）
      .catch((error) => console.log(error)); // ❌ 如果失敗則在 console 顯示錯誤
  }, [id]); // ✅ 依賴陣列：當 id 改變時才會重新執行 effect

  if (!product) return <div>Loading</div>;
  const ProductDetails = [
    { label: 'Name', value: product.name },
    { label: 'Description', value: product.description },
    { label: 'Type', value: product.type },
    { label: 'Brand', value: product.brand },
    { label: 'Quantity in stock', value: product.quantityInStock },
  ];

  return (
    <Grid2 container spacing={6} maxWidth="lg">
      <Grid2 size={6}>
        <img
          src={product?.pictureUrl}
          alt={product.name}
          style={{ width: '100%' }}
        />
      </Grid2>
      <Grid2 size={6}>
        <h3 className="fw-bold">{product.name}</h3>
        <hr className=" mb-3" />
        <h4 className="fw-bold text-secondary">$({product.price / 100})</h4>
        <div className=" table-responsive">
          <table className="table">
            <tbody>
              {ProductDetails.map((detail, index) => {
                return (
                  <tr key={index}>
                    <td style={{ fontWeight: 'bold' }}>{detail.label}</td>
                    <td>{detail.value}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* gx bs5元素水平間誒距 */}
        <div className=" d-flex align-items-end  gap-3 mt-3">
          {/* 數量輸入欄位 */}
          <div className="flex-grow-1">
            <label htmlFor="quantity" className="form-label">
              購買數量
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              className="form-control"
              defaultValue={1}
            />
          </div>

          {/* 加入購物車按鈕 */}
          <div>
            <button type="button" className="btn btn-primary btn-md">
              Add to basket
            </button>
          </div>
        </div>
      </Grid2>
    </Grid2>
  );
}
