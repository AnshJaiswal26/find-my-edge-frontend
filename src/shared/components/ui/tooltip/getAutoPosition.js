export function getAutoPosition(
  rect,
  tooltipWidth,
  tooltipHeight,
  dynamicOffset,
) {
  const space = {
    top: rect.top - 60,
    bottom: window.innerHeight - rect.bottom,
    left: rect.left,
    right: window.innerWidth - rect.right,
  };

  if (space.top >= tooltipHeight + dynamicOffset) return "top";
  if (space.bottom >= tooltipHeight + dynamicOffset) return "bottom";
  if (space.right >= tooltipWidth + dynamicOffset) return "right";
  if (space.left >= tooltipWidth + dynamicOffset) return "left";

  return "bottom";
}
