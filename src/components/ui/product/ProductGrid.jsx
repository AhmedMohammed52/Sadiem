import ProductCard from "./ProductCard";

export default function ProductGrid({ products = [] }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-5 lg:grid-cols-4">
      {products.map((product) => (
        <div key={product.id} className="animate-rise">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
