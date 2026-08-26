import { BUSINESS } from "@/lib/seo";
import { FiFacebook, FiInstagram } from "react-icons/fi";
import { SiTiktok } from "react-icons/si";

export const Footer = () => {
  return (
    <footer
      className="-mx-4 md:-mx-16 mt-12 border-t px-4 py-10 text-center"
      style={{
        borderColor: "rgba(201,132,154,0.15)",
        backgroundColor: "var(--color-brand-plum-footer)",
      }}
    >
      <div
        className="wm-h-card italic mb-2"
        style={{ color: "var(--color-brand-gold)" }}
      >
        Wizzington Moo&apos;s Boutique
      </div>
      <address
        className="not-italic text-xs tracking-[0.05em] mb-4"
        style={{ color: "rgba(245,237,232,0.5)" }}
      >
        {BUSINESS.addressLocality}, {BUSINESS.addressRegion} {BUSINESS.postalCode},
        United Kingdom ·{" "}
        <a
          href={`tel:${BUSINESS.telephone}`}
          className="underline decoration-dotted"
        >
          +44 7855 383759
        </a>
      </address>
      <div className="flex items-center justify-center gap-4 mb-4">
        <a
          href={BUSINESS.sameAs[0]}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Wizzington Moo's on Facebook"
          style={{ color: "var(--color-brand-gold-light)" }}
        >
          <FiFacebook size={18} />
        </a>
        <a
          href={BUSINESS.sameAs[1]}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Wizzington Moo's on TikTok"
          style={{ color: "var(--color-brand-gold-light)" }}
        >
          <SiTiktok size={16} />
        </a>
        <a
          href={BUSINESS.sameAs[2]}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Wizzington Moo's on Instagram"
          style={{ color: "var(--color-brand-gold-light)" }}
        >
          <FiInstagram size={18} />
        </a>
      </div>
      <div
        className="text-xs tracking-[0.1em]"
        style={{ color: "rgba(245,237,232,0.3)" }}
      >
        © {new Date().getFullYear()} · United Kingdom · Dancewear &amp; Pageant
        Couture · Worldwide Shipping
      </div>
    </footer>
  );
};
