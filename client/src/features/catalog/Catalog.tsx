import { Grid2, Typography } from '@mui/material';
import { useFetchFiltersQuery, useFetchProductsQuery } from './catalogApi';
import ProductList from './ProductList';
import Filters from './Filters';
import { useAppSelector } from '../../app/store/store';
import AppPagination from '../../app/shared/components/AppPagination';
import { useDispatch } from 'react-redux';
import { setPageNumber } from './catalogSlice';

export default function Catalog() {

  // Redux管理參數
  // Redux store 讀取的"查詢參數"(state) Redux hook catalogSlice 同步
  // 底下是專門管state的slice 自訂的 Redux hook：useAppSelector (有型別) : catalog Slice的 state
  // productParams 裡包含 orderBy、keyword、types、brands、pageNumber、pageSize 
  const productParams = useAppSelector(state => state.catalog); //僅是讀取查詢參數(同步)

  // 底下是專門管query的slice
  // 呼叫 RTK Query hook catalogApi Slice ，傳入上方的查詢參數 非同步
  // 回傳查詢資料（data）、載入狀態（isLoading） ， RTK Query 根據參數變化決定是否重新發送請求（有快取機制）
  // 整合同步狀態一般state（Redux）+ 非同步查詢（RTK Query 查詢資料）流程
  // 對應到裡面 builder.query() 定義的 endpoint
  const { data, isLoading } = useFetchProductsQuery(productParams); //實際發送API請求(非同步)
  //query 回傳資料儲存到filterData變數 傳給Filter.tsx使用 data query查詢完拿到的資料是 filtersData : { brands: string[]; types: string[];}
  const { data: filtersData ,isLoading : filtersLoading} = useFetchFiltersQuery();
  const dispatch = useDispatch(); //使用Redux store 裡面的dispatch

  // 如果還在載入中或資料還沒回來，就顯示 Loading 畫面 一個是篩選區塊組件 一個是商品列表組件
  if (isLoading || !data || filtersLoading || !filtersData) return <div>資料載入中</div>;

  // 資料載入完成後渲染產品列表
  return (
    <Grid2 container spacing={4}>
      {/* 左側3/12 */}
      <Grid2 size={3}>
        {/* 傳遞key-value pair資料給子元素 類似這樣 filtersData : { brands: string[]; types: string[];*/}
        <Filters filtersData = {filtersData}/>
      </Grid2>
      {/* 右側9/12 */}
      <Grid2 size={9}>
        {/* Query 得到的商品清單 items存在不是undefined 且這個 Product[]長度不為0 */}
        {data.items && data.items.length > 0 ?
          (
            <>    {/* 重抓資料時底下這個元件會因為catalogApi RTK Query 的data更新 重新渲染 */}
              <ProductList products={data.items} />
              {/* shared-components 元件顯示*/}
              <AppPagination
                metadata={data.pagination} //拿到Query 查詢後得到的 分頁資料(裡面有totalCount currentPage 等屬性)從 headers 解析出來的分頁資訊
                onPageChange={(pageNumber: number) => {
                  dispatch(setPageNumber(pageNumber));
                  window.scrollTo({ top: 0, behavior: 'smooth' }); //window 瀏覽器全域物件 代表瀏覽器的視窗 scrollTo原生方法 捲動到會面最上方 切換分頁 更平順的流動
                }} //同理定義好這個傳給子元件的函式，也是必須符合一個number參數 且void沒有回傳值 具體參數值 實際上是透過AppPagination內部的運作得到 並回傳給 這裡的父元件使用
              /></>

          ) : (
            <Typography variant='h5'>此篩選條件下沒有結果</Typography>
          )}

      </Grid2>
    </Grid2>
  );
}
