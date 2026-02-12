import { ProductCardSkeleton } from "./productCard/ProductCardSkeleton";

export const ProductsSkeleton = ({ count }: { count: number }) => {
  return (
    <div className="flex flex-row flex-wrap justify-between mt-2">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};
