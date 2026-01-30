export const Separator = ({ className }: { className?: string }) => {
  return (
    <div
      className={`h-px w-full bg-gradient-to-r from-transparent/0 via-gray-300/100  to-transparent/0 ${className}`}
    />
  );
};
