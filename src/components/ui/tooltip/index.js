let tooltipEl = null;

const OFFSET = 10;
const MARGIN = 8;

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
  const size = 10;

  Object.assign(arrow.style, {
    position: "absolute",
    width: `${size}px`,
    height: `${size}px`,
    background: "#000",
    transform: "rotate(45deg)",
  });

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
  hideTooltip();

  const target = e.currentTarget;
  const rect = target.getBoundingClientRect();

  tooltipEl = document.createElement("div");

  Object.assign(tooltipEl.style, {
    position: "fixed",
    padding: "4px 10px",
    fontSize: "0.85rem",
    backgroundColor: "#000",
    color: "#fff",
    borderRadius: "4px",
    whiteSpace: "pre",
    pointerEvents: "none",
    zIndex: 9999,
    opacity: "0",
    transition: "opacity 0.12s ease",
    maxWidth: "260px",
  });

  // content
  const content = document.createElement("span");
  content.textContent = message;
  tooltipEl.appendChild(content);

  // arrow
  const arrow = document.createElement("div");
  tooltipEl.appendChild(arrow);

  document.body.appendChild(tooltipEl);

  const tooltipRect = tooltipEl.getBoundingClientRect();

  const finalPosition =
    position || getAutoPosition(rect, tooltipRect.width, tooltipRect.height);

  let top = 0;
  let left = 0;
  let anchorOffset = 0;

  // 🔥 SMART POSITIONING (NO translate(-50%))
  switch (finalPosition) {
    case "top":
    case "bottom": {
      const centerX = rect.left + rect.width / 2;

      // try centered
      let computedLeft = centerX - tooltipRect.width / 2;

      // 🔥 SOFT CLAMP (preserve anchor feel)
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

      // 🔥 Arrow alignment
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

      // 🔥 SOFT CLAMP (vertical)
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

      // 🔥 Arrow alignment
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

  // 🔥 Arrow aligned to actual anchor point
  setArrowPosition(arrow, finalPosition, anchorOffset - 5);

  requestAnimationFrame(() => {
    if (tooltipEl) tooltipEl.style.opacity = "0.95";
  });
}

export function hideTooltip() {
  if (tooltipEl) {
    tooltipEl.remove();
    tooltipEl = null;
  }
}
