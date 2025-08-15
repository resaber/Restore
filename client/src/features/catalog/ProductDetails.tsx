import { useParams } from 'react-router-dom';
import Grid2 from '@mui/material/Grid2';
import { useFetchProductDetailsQuery } from './catalogApi';

export default function ProductDetails() {
  // react-router-dom提供的hook  從 URL 取得參數 id，例如路徑是 /product/3，則 id = "3"
  // hover id 也可以看到 useParams裡面的每個參數都是 const id: string | undefined
  const { id } = useParams();
  //因為在catalogApi是定義id是number但是useParams是string 網址有帶 id，就轉成數字傳入；如果沒有，就傳 0（避免錯誤）
  const {data: product,isLoading} = useFetchProductDetailsQuery(id? parseInt(id) : 0);

  if(!product || isLoading) return <div>Loading...</div>

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
