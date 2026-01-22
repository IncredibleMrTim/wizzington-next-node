export const ProductDetailsSkeleton = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images Skeleton */}
        <div className="flex flex-col gap-4">
          {/* Main image */}
          <div className="relative w-full h-96 bg-gray-200 rounded-lg animate-pulse" />

          {/* Thumbnail images */}
          <div className="flex gap-2 overflow-x-auto">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="relative w-20 h-20 shrink-0 bg-gray-200 rounded animate-pulse"
              />
            ))}
          </div>
        </div>

        {/* Product Details Skeleton */}
        <div className="flex flex-col gap-4">
          {/* Title skeleton */}
          <div className="h-12 bg-gray-200 rounded animate-pulse w-3/4" />

          {/* Description skeleton */}
          <div className="space-y-2">
            <div className="h-5 bg-gray-200 rounded animate-pulse" />
            <div className="h-5 bg-gray-200 rounded animate-pulse w-5/6" />
          </div>

          {/* Price and stock skeleton */}
          <div className="flex gap-4 items-center pt-2">
            <div className="h-10 bg-gray-200 rounded animate-pulse w-32" />
            <div className="h-5 bg-gray-200 rounded animate-pulse w-40" />
          </div>

          {/* Info box skeleton */}
          <div className="bg-gray-100 border border-gray-200 rounded p-3 mt-2">
            <div className="h-5 bg-gray-200 rounded animate-pulse w-1/2" />
          </div>
        </div>
      </div>

      {/* Product Specification Form Skeleton */}
      <div className="mt-8">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-1/4 mb-4" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-5 bg-gray-200 rounded animate-pulse w-1/4" />
              <div className="h-10 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
