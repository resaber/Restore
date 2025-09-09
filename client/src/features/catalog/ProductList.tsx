
import type { Product } from "../../app/models/product"
import ProductCard from "./ProductCard"

//catalog.tsx 組件傳過來的參數
type Props =
{
    products : Product[]
}
export default function ProductList({products}:Props) {
  return (
    // 🔸 外層使用 Bootstrap 5 的 flex 容器，支援多欄自動換行
    <div className="d-flex flex-wrap justify-content-center gap-4">
      {/* 🔸 對每個商品建立一個欄位（Bootstrap col），並顯示商品卡片 */}
      {products.map((product) => (
        // col-12: 在手機滿寬；col-sm-6: 小螢幕一排 2 個；col-md-4: 中螢幕一排 3 個；col-lg-3: 大螢幕一排 4 個
        <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex">
          {/* 🔸 顯示每個商品的卡片元件把參數傳遞過去 */}
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}