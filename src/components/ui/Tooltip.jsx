import { useUIStore } from "@stores";

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

export default function Tooltip() {
  const tooltip = useUIStore((s) => s.tooltip);

  if (!tooltip.visible || !tooltip.rect) return null;

  const placement = resolvePlacement(
    tooltip.rect,
    tooltip.placement || "auto",
    ESTIMATED_TOOLTIP_SIZE
  );

  const { x, y } = getTooltipPosition(tooltip.rect, placement);

  return (
    <div
      style={{
        position: "fixed",
        top: y,
        left: x,
        transform: getTransform(placement),
        zIndex: 9999,
        color: tooltip?.color || "white",
      }}
      className="
        pointer-events-none
        relative
        rounded bg-black/95 text-white
        text-xs px-2 py-1
        whitespace-pre
        shadow-lg
      "
    >
      {tooltip.content}

      {/* Arrow */}
      <div className={getArrowStyle(placement)} />
    </div>
  );
}
