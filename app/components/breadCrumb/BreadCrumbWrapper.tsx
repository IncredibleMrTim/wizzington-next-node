"use client";
import { usePathname } from "next/navigation";
import { useProductStore } from "@/stores/product/useProductStore";
import { BreadCrumb } from "./BreadCrumb";

const BreadCrumbWrapper = () => {
  // get pathname and product from the store
  const product = useProductStore((state) => state.currentProduct);
  const pathname = usePathname();

  // get the segments of the path
  const hiddenSegments = ["admin", "basket"];

  // filter out empty segments and hidden segments
  const segments = pathname
    .split("/")
    .filter((segment) => segment !== "" && !hiddenSegments.includes(segment));

  return (
    <BreadCrumb pathname={pathname} product={product} segments={segments} />
  );
};

export default BreadCrumbWrapper;
