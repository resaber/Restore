
import { useFetchProductsQuery } from "./catalogApi";
import ProductList from "./ProductList";


export default function Catalog() {
  // 呼叫 RTK Query hook，取得資料與 loading 狀態
  const { data, isLoading } = useFetchProductsQuery();

  // 如果還在載入中或資料還沒回來，就顯示 Loading 畫面
  if (isLoading || !data) return <div>資料載入中</div>;

  // 資料載入完成後渲染產品列表
  return (
    <>
      <ProductList products={data} />
    </>
  );
}