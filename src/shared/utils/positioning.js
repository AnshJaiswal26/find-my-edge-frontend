export function computePosition({
  targetRect,
  floatingRect,
  preferred = "top",
  offset = 8,
  margin = 8,
}) {
  const positions = ["top", "bottom", "right", "left"];

  const getCoords = (pos) => {
    switch (pos) {
      case "top":
        return {
          top: targetRect.top - floatingRect.height - offset,
          left: targetRect.left + targetRect.width / 2 - floatingRect.width / 2,
        };

      case "bottom":
        return {
          top: targetRect.bottom + offset,
          left: targetRect.left + targetRect.width / 2 - floatingRect.width / 2,
        };

      case "left":
        return {
          top: targetRect.top + targetRect.height / 2 - floatingRect.height / 2,
          left: targetRect.left - floatingRect.width - offset,
        };

      case "right":
        return {
          top: targetRect.top + targetRect.height / 2 - floatingRect.height / 2,
          left: targetRect.right + offset,
        };
    }
  };

  const fits = (coords) => {
    return (
      coords.left >= margin &&
      coords.top >= margin &&
      coords.left + floatingRect.width <= window.innerWidth - margin &&
      coords.top + floatingRect.height <= window.innerHeight - margin
    );
  };

  // Try preferred first
  let coords = getCoords(preferred);
  if (fits(coords)) return { ...coords, placement: preferred };

  // Fallbacks
  for (const pos of positions) {
    coords = getCoords(pos);
    if (fits(coords)) return { ...coords, placement: pos };
  }

  // Worst case
  return { ...coords, placement: preferred };
}

export function positionElement(targetEl, floatingEl, options = {}) {
  const targetRect = targetEl.getBoundingClientRect();

  floatingEl.style.position = "fixed";
  floatingEl.style.top = "0px";
  floatingEl.style.left = "0px";

  // Must be visible to measure
  floatingEl.style.visibility = "hidden";
  floatingEl.style.display = "block";

  const floatingRect = floatingEl.getBoundingClientRect();

  const { top, left, placement } = computePosition({
    targetRect,
    floatingRect,
    ...options,
  });

  floatingEl.style.transform = `translate3d(${left}px, ${top}px, 0)`;
  floatingEl.style.visibility = "visible";

  return placement;
}
