"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"

interface HomeHeroProps {
  danceWearHref?: string
  pageantWearHref?: string
}

export const HomeHero = ({
  danceWearHref = "/",
  pageantWearHref = "/",
}: HomeHeroProps) => {
  const pathname = usePathname()

  // Only show on home page
  if (pathname !== "/") {
    return null
  }

  return (
    <>
      <div className="relative w-full overflow-hidden bg-brand-plum">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat opacity-30"
          style={{
            backgroundImage: "url('/header-model.jpg')",
            backgroundPosition: "30% 20%",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 100% at 50% 50%, transparent 30%, var(--color-brand-plum) 100%)",
          }}
        />
        <div className="relative flex flex-col items-center gap-6 px-4 py-20 md:py-28 text-center">
          <span
            className="text-xs md:text-[0.72rem] tracking-[0.3em] uppercase"
            style={{
              color: "var(--color-brand-gold)",
            }}
          >
            Dancewear &amp; Pageant Couture
          </span>
          <h1
            className="wm-h-hero max-w-4xl leading-[1.1]"
            style={{
              color: "var(--color-brand-cream)",
              fontWeight: 700,
            }}
          >
            Costumes that transform every{" "}
            <em style={{ color: "var(--color-brand-rose-light)", fontStyle: "italic" }}>
              performance
            </em>{" "}
            into an unforgettable spectacle
          </h1>
          <div
            className="max-w-xl text-base md:text-lg leading-relaxed"
            style={{
              color: "rgba(245,237,232,0.65)",
            }}
          >
            Embracing individuality and artistry — each piece is crafted to make
            you shine, from studio rehearsals to the competition stage.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
            <Link
              href={danceWearHref}
              className="rounded-full px-8 py-3 text-xs font-semibold uppercase tracking-[0.1em] transition-colors"
              style={{
                backgroundColor: "var(--color-brand-gold)",
                color: "var(--color-brand-plum)",
              }}
            >
              Shop Dance Wear
            </Link>
            <Link
              href={pageantWearHref}
              className="rounded-full px-8 py-3 text-xs font-normal uppercase tracking-[0.1em] border transition-colors"
              style={{
                borderColor: "rgba(232,180,196,0.4)",
                color: "var(--color-brand-rose-light)",
              }}
            >
              Pageant Wear
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
