const directionMap = {
  right: "right-0 top-1/2 -translate-y-1/2",
  left: "left-0 top-1/2 -translate-y-1/2",
  bottom: "bottom-0 left-1/2 -translate-x-1/2",
  top: "top-0 left-1/2 -translate-x-1/2",
  center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
};

export default function DragHandle({
  direction = "center",
  onPointerDown = () => null,
  className = "",
  children,
}) {
  return (
    <div
      onPointerDown={(e) => onPointerDown(e, direction)}
      className={`
        absolute
        ${directionMap[direction]}
        flex items-center justify-center cursor-grab
        ${className}
      `}
    >
      {children}
    </div>
  );
}
