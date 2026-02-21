export default function Divider({ vertical = false, className }) {
  return (
    <div
      className={`${
        vertical
          ? "self-stretch border-l border-(--border)"
          : "w-full border-t border-(--border)"
      } ${className}`}
    />
  );
}
