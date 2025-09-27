import { useRef, useState } from "react";

export function PriceTrackerContainer({ children, isMinimized }) {
  const popupRef = useRef(null);

  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    if (
      e.target.closest(`.controlBtn`) ||
      e.target.closest("input") ||
      e.target.closest("button")
    ) {
      return;
    }

    setDragging(true);
    const rect = popupRef.current.getBoundingClientRect();
    setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;

    const maxX = window.innerWidth - popupRef.current.offsetWidth;
    const maxY = window.innerHeight - popupRef.current.offsetHeight;

    setPosition({
      x: Math.max(0, Math.min(e.clientX - offset.x, maxX)),
      y: Math.max(0, Math.min(e.clientY - offset.y, maxY)),
    });
  };

  const handleMouseUp = () => setDragging(false);

  return (
    <div
      ref={popupRef}
      className={`price-tracker-container ${isMinimized ? "minimized" : ""}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        cursor: dragging ? "move" : "default",
      }}
    >
      {children}
    </div>
  );
}
