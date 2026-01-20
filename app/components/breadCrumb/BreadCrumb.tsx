import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/ui/breadcrumb";
import { segmentMappings } from "./breadcrumbMappings";
import { ProductDTO } from "@/lib/types";

interface BreadCrumbProps {
  pathname: string;
  product?: ProductDTO | null;
  segments: string[];
}

export const BreadCrumb = ({
  pathname,
  product,
  segments,
}: BreadCrumbProps) => {
  const shouldHide = pathname.includes("admin") || pathname.includes("auth");

  if (shouldHide) {
    return null;
  }

  return (
    <div className="items-center justify-between text-black p-4 hidden md:flex">
      <Breadcrumb>
        <BreadcrumbList>
          {segments.map((segment, index) => {
            const isProducts = segmentMappings[segment] === "Products";
            const href = isProducts
              ? "/"
              : segments.slice(0, index + 1).join("/");
            const label =
              segmentMappings[segment] || product?.name?.replace(/-/g, " ");
            const isLastSegment = index === segments.length - 1;

            return (
              <div key={index} className="flex place-items-center gap-2">
                <BreadcrumbItem key={index}>
                  <Link href={`/${href}`}>{label}</Link>
                </BreadcrumbItem>

                {!isLastSegment && (
                  <BreadcrumbSeparator>
                    <p>/</p>
                  </BreadcrumbSeparator>
                )}
              </div>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};
