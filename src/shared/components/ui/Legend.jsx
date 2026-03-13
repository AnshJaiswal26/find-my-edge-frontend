export default function Legend({
  color,
  label,
  selected,
  onClick = () => null,
  onMouseEnter = () => null,
  onMouseLeave = () => null,
  className = "",
}) {
  return (
    <div
      className={`flex items-center text-[0.93rem] text-[hsl(var(--text-charts))] ${className}`}
    >
      <div
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`
          flex items-center
          gap-[5px]
          px-1
          rounded-[5px]
          cursor-pointer
          ${selected ? "" : "opacity-30"}
        `}
      >
        {Array.isArray(color) ? (
          color.map((c, i) => (
            <div
              key={i}
              className="w-[0.9rem] h-[0.9rem] rounded-full"
              style={{ backgroundColor: c || "var(--info)" }}
            />
          ))
        ) : (
          <div
            className="w-[0.9rem] h-[0.9rem] rounded-full"
            style={{ backgroundColor: color || "var(--info)" }}
          />
        )}

        <span>{label}</span>
      </div>
    </div>
  );
}
