import { useRef, useState } from "react";

export function ZoomableImage({ src }) {
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY * 0.001;
    setScale((prev) => Math.min(Math.max(prev + delta, 0.5), 3));
  };

  const reset = () => {
    setScale(1);
    setPos({ x: 0, y: 0 });
  };

  return (
    <div
      className="w-full h-[95%] flex-3 mt-1.5 overflow-hidden cursor-grab active:cursor-grabbing rounded-lg border border-(--border)"
      onWheel={handleWheel}
      onDoubleClick={reset}
    >
      <img
        src={src}
        draggable={false}
        className="select-none pointer-events-none h-full w-full border border-(--border)"
        style={{
          transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
          transformOrigin: "center",
          transition: dragging.current ? "none" : "transform 0.1s ease-out",
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "cover",
        }}
      />
    </div>
  );
}
