export const Separator = ({ className }: { className?: string }) => {
  return (
    <div
      className={`h-px w-full ${className}`}
      style={{
        background:
          "linear-gradient(to right, transparent, rgba(200,169,110,0.4), transparent)",
      }}
    />
  );
};
