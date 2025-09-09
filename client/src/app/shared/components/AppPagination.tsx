import { Box, Pagination, Typography } from '@mui/material';
import type { Pagination as PaginationType } from '../../models/pagination';

type Props = {
    //傳進來 要符合分頁type 規格
    metadata: PaginationType;
    //定義頁數變化時 需要的參數 函式
    onPageChange: (pageNumber: number) => void;
};

export default function AppPagination({ metadata, onPageChange }: Props) {
    const { currentPage, totalPages, pageSize, totalCount } = metadata;
    //顯示的開頭資料 是第x筆 結束資料 顯示那個頁面的最後一筆 或是總筆數 例如46 每頁10筆 在第五頁則顯示 41/46
    const startItem = (currentPage - 1 ) * pageSize + 1;
    const endItem = Math.min(currentPage*pageSize , totalCount)

    return (
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            marginTop={3}
        >
            <Typography>顯示{startItem}到{endItem}筆資料 總共{totalCount}筆資料</Typography>
            <Pagination
                color="secondary"
                size="large"
                count={totalPages} //顯示共有多少頁數
                page={currentPage} //目前頁數
                onChange={(_,page) => onPageChange(page)}
            />
        </Box>
    );
}
