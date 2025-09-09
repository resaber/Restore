export function currencyFormate(amount : number){
    return '$'+(amount/100);

}
//對應到catalogApi.ts 那裏把參數傳遞過來
export function filterEmptyValues(values : object)
{
      // 把物件轉成 key-value 陣列 → 過濾掉空值 → 再轉回物件
         return Object.fromEntries(
                
              //把物件轉成陣列(key-value pairs)處理 在用fromEntries 轉回物件
              //[
              //   ['orderBy', 'price'],
              //   ['keyword', ''],
              //   ['types', []],
              //   ['pageNumber', 1],
              //   ['pageSize', 10]
              // ]
              //filter true的結果元素會被保留 並組成一個新的陣列
              Object.entries(values).filter(
                //解構只取第二個[key,value] filter不需要key 只要value就好
                //例如只要orderBy後面的那個value price
                ([, value]) =>
                  value !== '' &&
                  value !== null &&
                  value !== undefined &&
                  !(Array.isArray(value) && value.length === 0) // 排除空陣列 > false 過濾掉
              )
        )
}