
import type { Product } from "../../app/models/product"
import ProductCard from "./ProductCard"

type Props =
{
    products : Product[]
}
export default function ProductList({products}:Props) {
  return (
     <div className="d-flex flex-wrap justify-content-center gap-4">
      {products.map((product) => {
        return <ProductCard key={product.id} product={product} />
      })}
     </div>
  )
}