import { useParams } from 'react-router-dom';

import { useFetchProductDetailsQuery } from './catalogApi';
import { Grid, TextField } from '@mui/material';
import { useAddBasketItemMutation, useFetchBasketQuery, useRemoveBasketItemMutation } from '../basket/basketApi';
import { useEffect, useState, type ChangeEvent } from 'react';

export default function ProductDetails() {
  // react-router-dom提供的hook  從 URL 取得參數 id，例如路徑是 /product/3，則 id = "3"
  // hover id 也可以看到 useParams裡面的每個參數都是 const id: string | undefined
  const { id } = useParams();
  //陣列解構
  const [removeBasketItem] = useRemoveBasketItemMutation();
  const [addBasketItem] = useAddBasketItemMutation();
  //物件解構
  const{data:basket} = useFetchBasketQuery();
  //從這網址的id值 先檢查這個id存不存在 不存在 item - undefined   存在拿來比對是購物車的哪個購物車子項目
  // const item = id ? basket?.items.find(x => x.productId === Number(id)) : undefined;
  //ts 寫法 + 把字串轉型成數字 ! 非空斷言 斷言id不為null/undefined
  const item = basket?.items.find(x => x.productId === +id!); //3

  //設定state hook
  const [quantity,setQuantity] = useState(0); 
  //設定副作用函式 當依賴陣列[item]改變 if(item)購物車有該商品，則修改數量到state中
  //useEffect語法 P2一定要是個陣列 當這個陣列裡面的的任何值改變時，也就是item整理是否有變動，執行Effect裡面的函式
  useEffect(() => {
    if(item) setQuantity(item.quantity);
  },[item])



  //因為在catalogApi是定義id是number但是useParams是string 網址有帶 id，就轉成數字傳入；如果沒有，就傳 0（避免錯誤）
  const { data: product, isLoading } = useFetchProductDetailsQuery(
    id ? parseInt(id) : 0
  );

  if (!product || isLoading) return <div>Loading...</div>;

  const handleUpdateBasket = () => {
    // 變動的數量
   const updateQuantity = item ? Math.abs(quantity - item.quantity) : quantity;
   //沒加入該商品 或是 想要的數量大於原本的數量 觸發
   if(!item || quantity > item.quantity){
    addBasketItem({product,quantity:updateQuantity})
   }else{
    //否則移除商品數量 
    removeBasketItem({productId : product.id , quantity:updateQuantity});
   }
  }

  const handleInputChange = (e:ChangeEvent<HTMLInputElement>) => {
    //ts 將輸入的字串轉型成number
    const value = +e.currentTarget.value;

    if(value >= 0)
      setQuantity(value);
  }


  if (!product) return <div>Loading</div>;
  const ProductDetails = [
    { label: 'Name', value: product.name },
    { label: 'Description', value: product.description },
    { label: 'Type', value: product.type },
    { label: 'Brand', value: product.brand },
    { label: 'Quantity in stock', value: product.quantityInStock },
  ];

  return (
    <Grid container spacing={6} maxWidth="lg">
      <Grid size={6}>
        <img
          src={product?.pictureUrl}
          alt={product.name}
          style={{ width: '100%' }}
        />
      </Grid>
      <Grid size={6}>
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

        <div className="row align-items-end  mt-3">
          {/* 數量輸入欄位 */}
          <div className="col-sm-6">
            <TextField
              variant="outlined"
              type="number"
              label="在購物車裡的數量"
              fullWidth
              value={quantity}
              onChange={handleInputChange}
            />
          </div>

          {/* 加入購物車按鈕 */}
          <div className="col-sm-6">
            <button type="button" 
                    className="btn btn-primary btn-md w-100"
                    style={{height : '56px'}} 
                    onClick={handleUpdateBasket} 
                    //不更新的情況 1.數量相等 2.或是沒選擇商品 且數量是0
                    disabled = {quantity === item?.quantity || !item && quantity === 0}
                    
                    >
               {item ?  '更新數量' : '加入購物車'}
            </button>
          </div>
        </div>
      </Grid>
    </Grid>
  );
}
