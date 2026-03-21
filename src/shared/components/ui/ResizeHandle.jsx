const directionMap = {
  right: "right-0",
  left: "left-0",
  bottom: "bottom-0",
  top: "top-0",
};

export default function ResizeHandle({
  direction = "right",
  onPointerDown = () => null,
  className,
}) {
  const vertical = direction === "top" || direction === "bottom";

  return (
    <div
      onPointerDown={(e) => onPointerDown(e, direction)}
      className={`
        absolute 
        ${vertical ? "w-full cursor-row-resize h-1" : "h-full cursor-col-resize w-1"} 
        hover:bg-(--cyan) 
        ${directionMap[direction]} ${className}`}
    />
  );
}
