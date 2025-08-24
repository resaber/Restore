import type { Product } from "./product";

export type Basket = {
  basketId: string
  items: Item[]
}

//購物車的單一商品 為甚麼要用class建立?思考
export class Item  {
  constructor(product: Product , quantity : number)
  {
    this.productId = product.id;
    this.name = product.name;
    this.price = product.price;
    this.pictureUrl = product.pictureUrl
    this.brand = product.brand;
    this.type = product.type;
    //指定自己獨有的數量屬性
    this.quantity = quantity
  }
  
  productId: number
  name: string
  price: number
  pictureUrl: string
  brand: string
  type: string
  quantity: number
}
