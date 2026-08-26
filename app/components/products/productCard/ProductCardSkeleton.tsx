export const ProductCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 text-black w-60 h-100 mb-8">
      <div className="flex flex-col gap-4 h-full">
        {/* Image skeleton */}
        <div className="relative flex-1 rounded-sm bg-brand-plum-light overflow-hidden animate-pulse" />

        {/* Content skeleton */}
        <div className="flex flex-col gap-2 px-4 justify-center w-full">
          {/* Title skeleton */}
          <div className="h-6 bg-brand-plum-light rounded animate-pulse" />

          {/* Description skeleton */}
          <div className="h-4 bg-brand-plum-light rounded animate-pulse w-4/5 mx-auto" />

          {/* Price skeleton */}
          <div className="h-5 bg-brand-plum-light rounded animate-pulse w-1/3 mx-auto" />
        </div>
      </div>
    </div>
  );
};
