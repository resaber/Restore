import { IconButton } from '@mui/material';
import type { Item } from '../../app/models/basket';
import { Add, Close, Remove } from '@mui/icons-material';
import { useAddBasketItemMutation, useRemoveBasketItemMutation } from './basketApi';
import { currencyFormate } from '../../lib/util';

//引入model basket.ts <Item></Item>
type Props = {
  item: Item;
};

export default function BasketItem({ item }: Props) {

  //陣列解構   RTK Query 每個 mutation 會產生一個 hook const [trigger, result] = useSomeMutation();
  //hook mutation 進來 我們只要回傳陣列第一個元素 removeBasketItem 這個function
  const [removeBasketItem] = useRemoveBasketItemMutation();
  const [addBasketItem] = useAddBasketItemMutation();

  return (
    //把每個子選項列出來印出
    <div
      className=" d-flex   justify-content-between align-items-center mb-2 rounded  shadow-sm p-2"
      style={{ height: '140px' , backgroundColor:' #d6d6d6 '}}
    >
      <div className="d-flex align-items-center">
        {/* 設定圖片 */}
        <img
          src={item.pictureUrl}
          alt={item.name}
          className="me-2 ms-1 rounded"
          style={{
          
            width: '100px',
            height: '100px',
            objectFit: 'cover',
            borderRadius: '4px',
          }}
        />
        {/* 購物車內的子項目描述 商品名稱 金額+小記  刪除+新增按鈕 這三部分垂直排列 */}
        <div className=" d-flex flex-column gap-1">
          <h6>{item.name}</h6>

          {/* 金額和當項小計 */}
          <div className=" d-flex align-items-center gap-3">
            <span style={{ fontSize: '1.1rem' }}>
              {currencyFormate(item.price)} x {item.quantity}
            </span>
            <span className="text-primary" style={{ fontSize: '1.1rem' }}>
              單項小計 :  {currencyFormate(item.price * item.quantity)}
            </span>
          </div>

          <div className="container d-flex gap-3 align-items-center">
            <IconButton
              //刪減這個 item數量
              onClick={() => removeBasketItem({productId:item.productId,quantity:1})}
              color="error"
              aria-label="移除按鈕"
              sx={{ border: 1, borderRadius: 1, minWidth: 0 }}
              size="small"
            >
              <Remove></Remove>
            </IconButton>
            {/* h6 垂直置中 */}
            <h6 className=" my-0">{item.quantity}</h6>
            <IconButton
              color="success"
              aria-label="新增按鈕"
              sx={{ border: 1, borderRadius: 1, minWidth: 0 }}
              size="small" 
              onClick={() => addBasketItem({product:item , quantity : 1})}
            >
              <Add />
            </IconButton>
          </div>
        </div>
      </div>
      {/* X Icon設定在右上方 保持點間距*/}
      <IconButton
        //將購物車子品項移除
        onClick={() => removeBasketItem({productId:item.productId , quantity:item.quantity})}
        color="error"
        aria-label="remove"
        sx={{
          border: 1,
          borderRadius: 1,
          minWidth: 0,
          //停留在父容器右上方
          alignSelf: 'start',
          marginRight: 1,
          mt: 1,
        }}
        size="small"
      >
        <Close />
      </IconButton>
    </div>
  );
}
