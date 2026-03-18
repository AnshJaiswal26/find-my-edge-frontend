import { dismissManager } from "@shared/components/ui/managers/index.js";

let tooltipEl = null;
let contentEl = null;
let arrowEl = null;

const OFFSET = 10;
const MARGIN = 8;

function ensureTooltip() {
  if (tooltipEl) return;

  tooltipEl = document.createElement("div");
  tooltipEl.className = "tooltip";

  contentEl = document.createElement("span");
  contentEl.className = "tooltip-text";

  arrowEl = document.createElement("div");
  arrowEl.className = "tooltip-arrow";

  tooltipEl.appendChild(contentEl);
  tooltipEl.appendChild(arrowEl);

  document.body.appendChild(tooltipEl);

  dismissManager.register(["scroll"], hideTooltip);
}

function getAutoPosition(rect, tooltipWidth, tooltipHeight) {
  const space = {
    top: rect.top,
    bottom: window.innerHeight - rect.bottom,
    left: rect.left,
    right: window.innerWidth - rect.right,
  };

  if (space.top >= tooltipHeight + OFFSET) return "top";
  if (space.bottom >= tooltipHeight + OFFSET) return "bottom";
  if (space.right >= tooltipWidth + OFFSET) return "right";
  if (space.left >= tooltipWidth + OFFSET) return "left";

  return "bottom";
}

function setArrowPosition(arrow, placement, anchorOffset) {
  const size = 8;

  // reset first (important)
  arrow.style.top = "";
  arrow.style.left = "";
  arrow.style.right = "";
  arrow.style.bottom = "";

  switch (placement) {
    case "top":
      arrow.style.bottom = `-${size / 2}px`;
      arrow.style.left = `${anchorOffset}px`;
      break;

    case "bottom":
      arrow.style.top = `-${size / 2}px`;
      arrow.style.left = `${anchorOffset}px`;
      break;

    case "left":
      arrow.style.right = `-${size / 2}px`;
      arrow.style.top = `${anchorOffset}px`;
      break;

    case "right":
      arrow.style.left = `-${size / 2}px`;
      arrow.style.top = `${anchorOffset}px`;
      break;
  }
}

export function showTooltip(e, message, position) {
  ensureTooltip();

  const target = e.currentTarget;
  const rect = target.getBoundingClientRect();

  // update content
  contentEl.textContent = message;

  tooltipEl.style.opacity = "0";
  tooltipEl.style.display = "block";

  const tooltipRect = tooltipEl.getBoundingClientRect();

  const finalPosition =
    position || getAutoPosition(rect, tooltipRect.width, tooltipRect.height);

  let top = 0;
  let left = 0;
  let anchorOffset = 0;

  switch (finalPosition) {
    case "top":
    case "bottom": {
      const centerX = rect.left + rect.width / 2;

      let computedLeft = centerX - tooltipRect.width / 2;

      const overflowLeft = MARGIN - computedLeft;
      const overflowRight =
        computedLeft + tooltipRect.width - window.innerWidth + MARGIN;

      if (overflowLeft > 0) {
        computedLeft += overflowLeft;
      } else if (overflowRight > 0) {
        computedLeft -= overflowRight;
      }

      left = computedLeft;

      top =
        finalPosition === "top"
          ? rect.top - OFFSET - tooltipRect.height
          : rect.bottom + OFFSET;

      const rawOffset = centerX - left;
      const arrowPadding = 12;

      anchorOffset = Math.max(
        arrowPadding,
        Math.min(rawOffset, tooltipRect.width - arrowPadding),
      );

      break;
    }

    case "left":
    case "right": {
      const centerY = rect.top + rect.height / 2;

      let computedTop = centerY - tooltipRect.height / 2;

      const overflowTop = MARGIN - computedTop;
      const overflowBottom =
        computedTop + tooltipRect.height - window.innerHeight + MARGIN;

      if (overflowTop > 0) {
        computedTop += overflowTop;
      } else if (overflowBottom > 0) {
        computedTop -= overflowBottom;
      }

      top = computedTop;

      left =
        finalPosition === "left"
          ? rect.left - OFFSET - tooltipRect.width
          : rect.right + OFFSET;

      const rawOffset = centerY - top;
      const arrowPadding = 12;

      anchorOffset = Math.max(
        arrowPadding,
        Math.min(rawOffset, tooltipRect.height - arrowPadding),
      );

      break;
    }
  }

  tooltipEl.style.top = `${top}px`;
  tooltipEl.style.left = `${left}px`;

  setArrowPosition(arrowEl, finalPosition, anchorOffset - 4);

  requestAnimationFrame(() => {
    tooltipEl.style.opacity = "1";
  });
}

export function hideTooltip() {
  if (!tooltipEl) return;

  tooltipEl.style.opacity = "0";
  tooltipEl.style.display = "none";
}
