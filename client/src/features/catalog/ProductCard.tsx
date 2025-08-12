// 從 MUI 引入 Card 元件（作為最外層的卡片容器）
import Card from '@mui/material/Card';

// 匯入 Product 型別，用來定義 props 的結構
import type { Product } from '../../app/models/product';

// 從 MUI 引入其他會用到的元件
import {
  Button,       // 按鈕元件
  CardActions,  // 卡片底部操作區域
  CardContent,  // 卡片主要內容區域
  CardMedia,    // 卡片圖片區域
  Typography,   // 文字排版元件
} from '@mui/material';

// 定義 props 的型別，這裡的 product 屬性必須符合 Product 型別
type Props = {
  product: Product;
};

// 預設匯出 ProductCard 元件，使用解構方式從 props 中取得 product
export default function ProductCard({ product }: Props) {
  return (
    // elevation={3} 設定陰影深度
    <Card elevation={3}
        sx={{
            width : 280,
            borderRadius : 2,
            display : 'flex',
            flexDirection : 'column',
            justifyContent : 'space-between'
        }}
        >
        
      {/* CardMedia 用來顯示圖片 */}
      <CardMedia
        sx={{ height: 240, backgroundSize: 'cover' }} // 設定圖片高度 & 背景填充方式
        image={product.pictureUrl} // 圖片來源
        title={product.name} // 圖片提示文字（用於輔助工具）
      />

      {/* CardContent 用來顯示主要的文字內容 */}
      <CardContent>
        <Typography
          gutterBottom // 在文字下方自動加入底部間距
          sx={{ textTransform: 'uppercase' }} // 文字轉為全大寫
          variant="subtitle2" // 字型樣式（副標題2）
        >
          {product.name} {/* 顯示商品名稱 */}
        </Typography>
        
        {/* 顯示價格，將價格（以分為單位）轉換為美元格式 */}
        <Typography variant="h6" sx={{ color: 'secondary.main' }}>
         ${Math.round(product.price / 100)}
        </Typography>
      </CardContent>

      {/* CardActions 用來放操作按鈕 */}
      <CardActions sx={{ justifyContent: 'space-between' }}>
        <Button>Add to Cart</Button> {/* 加入購物車按鈕 */}
        <Button>View</Button>        {/* 檢視商品詳情按鈕 */}
      </CardActions>
    </Card>
  );
}