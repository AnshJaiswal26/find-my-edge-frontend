export default function Skeleton({
  className = "",
  width,
  height,
  radius = "0.5rem",
}) {
  return (
    <div
      className={`relative overflow-hidden bg-(--surface-disabled) ${className}`}
      style={{
        width,
        height,
        borderRadius: radius,
      }}
    >
      <div className="shimmer" />
    </div>
  );
}
