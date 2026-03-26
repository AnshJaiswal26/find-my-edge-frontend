import { dismissManager } from "@shared/components/ui/managers/index.js";

let tooltipEl = null;
let contentEl = null;
let arrowEl = null;

let prevStyle = {
  tooltip: null,
  arrow: null,
};

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

function getAutoPosition(rect, tooltipWidth, tooltipHeight, dynamicOffset) {
  const space = {
    top: rect.top,
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

function setArrowPosition(arrow, placement, anchorOffset, style) {
  const size = 8;

  // reset first (important)
  arrow.style.top = "";
  arrow.style.left = "";
  arrow.style.right = "";
  arrow.style.bottom = "";

  prevStyle.arrow = arrow.style;

  if (style) Object.assign(arrow.style, style);

  if (style?.border) arrow.style.border = "";

  switch (placement) {
    case "top":
      arrow.style.bottom = `-${size / 2}px`;
      arrow.style.left = `${anchorOffset}px`;
      arrow.style.borderBottom = style?.border;
      arrow.style.borderRight = style?.border;
      break;

    case "bottom":
      arrow.style.top = `-${size / 2}px`;
      arrow.style.left = `${anchorOffset}px`;
      arrow.style.borderTop = style?.border;
      arrow.style.borderLeft = style?.border;
      break;

    case "left":
      arrow.style.right = `-${size / 2}px`;
      arrow.style.top = `${anchorOffset}px`;
      arrow.style.borderRight = style?.border;
      arrow.style.borderTop = style?.border;
      break;

    case "right":
      arrow.style.left = `-${size / 2}px`;
      arrow.style.top = `${anchorOffset}px`;

      arrow.style.borderLeft = style?.border;
      arrow.style.borderBottom = style?.border;
      break;
  }
}

export function showTooltip(e, options = {}) {
  ensureTooltip();

  const target = e.currentTarget;
  const rect = target.getBoundingClientRect();

  if (options.render) {
    contentEl.innerHTML = "";
    contentEl.appendChild(options.render());
  } else if (options.content) {
    contentEl.innerHTML = options.content;
  }

  if (options.class) {
    tooltipEl.classList.add(options.class);
  }

  tooltipEl.style.opacity = "0";
  tooltipEl.style.display = "block";

  prevStyle.tooltip = tooltipEl.tooltipStyle;

  if (options.tooltipStyle)
    Object.assign(tooltipEl.style, options.tooltipStyle);

  requestAnimationFrame(() => {
    const tooltipRect = tooltipEl.getBoundingClientRect();

    const dynamicOffset = Math.min(10, tooltipRect.height * 0.25);

    const finalPosition =
      options.position ||
      getAutoPosition(
        rect,
        tooltipRect.width,
        tooltipRect.height,
        dynamicOffset,
      );

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
            ? rect.top - dynamicOffset - tooltipRect.height
            : rect.bottom + dynamicOffset;

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
            ? rect.left - dynamicOffset - tooltipRect.width
            : rect.right + dynamicOffset;

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

    setArrowPosition(
      arrowEl,
      finalPosition,
      anchorOffset - 4,
      options.arrowStyle,
    );

    tooltipEl.style.opacity = "1";
  });
}

export function hideTooltip() {
  if (!tooltipEl) return;

  tooltipEl.style = prevStyle.tooltip;
  arrowEl.style = prevStyle.arrow;

  tooltipEl.style.opacity = "0";
  tooltipEl.style.display = "none";
}
