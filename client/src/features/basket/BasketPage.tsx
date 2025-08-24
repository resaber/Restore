import { useFetchBasketQuery } from './basketApi';
import BasketItem from './BasketItem';
import OrderSummary from '../../app/shared/components/OrderSummary';

export default function BasketPage() {
  //拿取GET /basket資料
  const { data, isLoading } = useFetchBasketQuery();
  if (isLoading) 
    return <p>載入購物車中</p>;

  //沒有購物車物件 或是原本的購物車物件裡面的items[]長度為0
  if (!data || data.items.length === 0) 
    return(
        <>
            <h3 className="mb-3">你的購物車目前沒有東西</h3>
        </>
    )
  //如果有資料回傳購物車內容
  return (
    <>
        <div className="container">
            <div className="row g-5">
                {/* 8/12 占用8等分的空間*/}
                <div className="col-8 bg-white p-3 rounded">
                    {/* 用 map 渲染購物車內的所有商品項目，每個都使用 BasketItem 元件顯示 */}
                    {data.items.map( item =>(
                        <BasketItem item={item} key = {item.productId}/>
                    ))}
                </div>
                 {/* 4/12 占用4等分*/}
                <div className="col-4 ">
                  <OrderSummary />
                </div>
            </div>
        </div>
    </>
  )
}
