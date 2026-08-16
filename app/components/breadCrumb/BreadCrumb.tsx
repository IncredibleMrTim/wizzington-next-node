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
    <div
      className="wm-scope items-center justify-between -mx-4 md:-mx-16 px-4 md:px-16 py-4 hidden md:flex"
      style={{ backgroundColor: "var(--wm-plum)" }}
    >
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
                  <Link
                    href={`/${href}`}
                    className="text-xs tracking-[0.08em] uppercase"
                    style={{
                      color: isLastSegment
                        ? "var(--wm-gold)"
                        : "var(--wm-rose)",
                      fontFamily: "var(--font-wm-body)",
                    }}
                  >
                    {label}
                  </Link>
                </BreadcrumbItem>

                {!isLastSegment && (
                  <BreadcrumbSeparator>
                    <span style={{ color: "var(--wm-rose)" }}>/</span>
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
