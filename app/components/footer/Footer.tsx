export const Footer = () => {
  return (
    <footer
      className="wm-scope -mx-4 md:-mx-16 mt-12 border-t px-4 py-10 text-center"
      style={{
        borderColor: "rgba(201,132,154,0.15)",
        backgroundColor: "var(--wm-plum-footer)",
      }}
    >
      <div
        className="wm-h-card italic mb-2"
        style={{ fontFamily: "var(--font-wm-display)", color: "var(--wm-gold)" }}
      >
        Wizzington Moo&apos;s Boutique
      </div>
      <div
        className="text-xs tracking-[0.1em]"
        style={{ color: "rgba(245,237,232,0.3)", fontFamily: "var(--font-wm-body)" }}
      >
        © {new Date().getFullYear()} · United Kingdom · Dancewear &amp; Pageant
        Couture
      </div>
    </footer>
  );
};
