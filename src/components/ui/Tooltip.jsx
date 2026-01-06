import { useEffect, useRef } from "react";

function getTooltipPosition(rect, placement, offset = 8) {
  switch (placement) {
    case "top":
      return {
        x: rect.left + rect.width / 2,
        y: rect.top - offset,
      };

    case "bottom":
      return {
        x: rect.left + rect.width / 2,
        y: rect.bottom + offset,
      };

    case "left":
      return {
        x: rect.left - offset,
        y: rect.top + rect.height / 2,
      };

    case "right":
      return {
        x: rect.right + offset,
        y: rect.top + rect.height / 2,
      };
  }
}

function resolvePlacement(rect, placement, tooltipSize, offset = 8) {
  if (placement !== "auto") return placement;

  const space = {
    top: rect.top,
    bottom: window.innerHeight - rect.bottom,
    left: rect.left,
    right: window.innerWidth - rect.right,
  };

  if (space.bottom >= tooltipSize.height + offset) return "bottom";
  if (space.top >= tooltipSize.height + offset) return "top";
  if (space.right >= tooltipSize.width + offset) return "right";
  if (space.left >= tooltipSize.width + offset) return "left";

  return "bottom";
}

function getTransform(placement) {
  switch (placement) {
    case "top":
      return "translate(-50%, -100%)";
    case "bottom":
      return "translate(-50%, 0)";
    case "left":
      return "translate(-100%, -50%)";
    case "right":
      return "translate(0, -50%)";
  }
}

function getArrowStyle(placement) {
  const base = "absolute w-2 h-2 bg-black/95 rotate-45";

  switch (placement) {
    case "top":
      return `${base} bottom-[-4px] left-1/2 -translate-x-1/2`;
    case "bottom":
      return `${base} top-[-4px] left-1/2 -translate-x-1/2`;
    case "left":
      return `${base} right-[-4px] top-1/2 -translate-y-1/2`;
    case "right":
      return `${base} left-[-4px] top-1/2 -translate-y-1/2`;
  }
}

const ESTIMATED_TOOLTIP_SIZE = { width: 260, height: 80 };

export const tooltipApi = {
  show: () => {},
  hide: () => {},
};

export default function Tooltip() {
  const ref = useRef(null);

  useEffect(() => {
    tooltipApi.show = ({
      rect,
      content,
      placement = "auto",
      color = "white",
      slide = 0,
    }) => {
      const el = ref.current;
      if (!el || !rect) return;

      const resolved = resolvePlacement(
        rect,
        placement,
        ESTIMATED_TOOLTIP_SIZE
      );

      const { x, y } = getTooltipPosition(rect, resolved);

      el.style.left = `${x + slide}px`;
      el.style.top = `${y}px`;
      el.style.transform = getTransform(resolved);
      el.style.color = color;

      el.querySelector("[data-content]").textContent = content;
      el.querySelector("[data-arrow]").className = getArrowStyle(resolved);

      el.style.opacity = "1";
    };

    tooltipApi.hide = () => {
      if (ref.current) ref.current.style.opacity = "0";
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        zIndex: 9999,
        opacity: 0,
        transition: "opacity 80ms linear",
      }}
      className="
        pointer-events-none
        rounded bg-black/95 text-white
        text-xs px-2 py-1
        whitespace-pre
        shadow-lg
      "
    >
      <span data-content />
      <div data-arrow />
    </div>
  );
}
