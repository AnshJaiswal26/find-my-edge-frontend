import { applyArrowStyles } from "./arrowPosition";
import { computePosition } from "./computePosition";

export function positionElement(targetEl, floatingEl, options = {}) {
  const {
    overflow = false,
    matchWidth = false,
    matchHeight = false,
    margin = 8,
    arrow = { show: false, style: {} },
  } = options;

  const targetRect = targetEl.getBoundingClientRect();

  floatingEl.style.position = "fixed";
  floatingEl.style.top = "0px";
  floatingEl.style.left = "0px";
  floatingEl.style.visibility = "hidden";
  floatingEl.style.display = "block";

  if (matchWidth) {
    floatingEl.style.width = `${targetRect.width}px`;
  }

  if (matchHeight) {
    floatingEl.style.height = `${targetRect.height}px`;
  }

  floatingEl.style.maxHeight = "";
  floatingEl.style.maxWidth = "";

  const floatingRect = floatingEl.getBoundingClientRect();

  const resolvedOffset = arrow.show
    ? Math.round(parseFloat(arrow.style.width || 10) / Math.sqrt(2))
    : (options.offset ?? 8);

  const result = computePosition({
    targetRect,
    floatingRect,
    ...options,
    offset: resolvedOffset,
  });

  let finalTop = result.top;
  let finalLeft = result.left;

  if (overflow) {
    floatingEl.style.maxHeight = `${Math.max(result.availableHeight, 100)}px`;
    floatingEl.style.maxWidth = `${Math.max(result.availableWidth, 100)}px`;
    floatingEl.style.overflowY = "auto";
    floatingEl.style.overflowX = "auto";

    const updatedRect = floatingEl.getBoundingClientRect();

    if (result.placement === "top") {
      finalTop = targetRect.top - updatedRect.height - resolvedOffset;
    }

    if (result.placement === "left") {
      finalLeft = targetRect.left - updatedRect.width - resolvedOffset;
    }

    finalTop = Math.max(margin, finalTop);
    finalLeft = Math.max(margin, finalLeft);
  }

  applyArrowStyles(floatingEl, result.placement, arrow);

  floatingEl.style.transform = `translate3d(${finalLeft}px, ${finalTop}px, 0)`;
  floatingEl.style.visibility = "visible";

  return result.placement;
}
