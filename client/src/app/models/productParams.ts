//這是前端查詢ts保護 要和後端C# 類別資料型別和 變數名稱一致
export type ProductParams = { //產品查詢時用的參數
    orderBy : string;
    keyword? : string;
    types : string[]; // 指定一定要有 不能是undefined
    brands : string[]; // too
    pageNumber : number;
    pageSize : number;
}