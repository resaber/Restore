// React + Bootstrap 5 版本（不使用 MUI）
// - 圖片等高：240px，object-fit: cover
// - 商品名稱：text-uppercase（全大寫）
// - 價格：整數顯示（Math.round）；要小數2位可改註解那一行

import type { Product } from "../../../app/models/product";

type Props = {
  product: Product;
};

export default function ProductCard2Bs({ product }: Props) {
  return (
    <div className="card shadow-sm d-flex flex-column justify-content-between" 
     style= {{width: 280, borderRadius : 8}} >
 {/* 原 MUI Card elevation={3} -> BS5 用 shadow-sm */}
      {/* 原 MUI CardMedia -> BS5 card-img-top */}
      <img
        src={product.pictureUrl}
        alt={product.name}
        className="card-img-top"
        style={{ height: 240, objectFit: 'cover' }} // 對應 sx={{ height: 240, backgroundSize: 'cover' }}
      />

      <div className="card-body">
        {/* 商品名稱：全大寫 */}
        <h6 className="card-title text-uppercase mb-2">
          {product.name}
        </h6>

        {/* 價格（以分為單位轉成整數美元） */}
        <h5 className="mb-0 text-secondary">
          ${Math.round(product.price / 100)}
          {/* 若要兩位小數：${(product.price / 100).toFixed(2)} */}
        </h5>
      </div>

      {/* 原 MUI CardActions -> 這裡用 card-body + flex，或改用 card-footer 也行 */}
      <div className="card-body pt-0">
        <div className="d-flex justify-content-between">
          <button type="button" className="btn btn-outline-primary">
            Add to Cart
          </button>
          <button type="button" className="btn btn-primary">
            View
          </button>
        </div>
      </div>
    </div>
  );
}
