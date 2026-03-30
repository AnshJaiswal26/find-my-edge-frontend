import { getCoordsByPlacement } from "./getCoordsByPlacement";

const positionsByAxis = {
  x: ["left", "right"],
  y: ["top", "bottom"],
  both: ["top", "bottom", "left", "right"],
};

function getEffectiveSize(floatingRect, viewport, margin, overflow) {
  return {
    width: overflow
      ? Math.min(floatingRect.width, viewport.width - margin * 2)
      : floatingRect.width,

    height: overflow
      ? Math.min(floatingRect.height, viewport.height - margin * 2)
      : floatingRect.height,
  };
}

function fitsInViewport(coords, floatingSize, viewport, margin) {
  return (
    coords.left >= margin &&
    coords.top >= margin &&
    coords.left + floatingSize.width <= viewport.width - margin &&
    coords.top + floatingSize.height <= viewport.height - margin
  );
}

function applyShift(coords, floatingSize, viewport, margin, offset) {
  return {
    top: Math.max(
      margin,
      Math.min(coords.top, viewport.height - floatingSize.height - offset),
    ),
    left: Math.max(
      margin,
      Math.min(coords.left, viewport.width - floatingSize.width - offset),
    ),
  };
}

function getAvailableSpace(placement, targetRect, viewport, margin, offset) {
  const shiftPadding = margin + offset;

  return {
    availableHeight:
      placement === "top"
        ? targetRect.top - shiftPadding
        : placement === "bottom"
          ? viewport.height - targetRect.bottom - shiftPadding
          : viewport.height - margin * 2,

    availableWidth:
      placement === "left"
        ? targetRect.left - shiftPadding
        : placement === "right"
          ? viewport.width - targetRect.right - shiftPadding
          : viewport.width - margin * 2,
  };
}

export function computePosition({
  targetRect,
  floatingRect,
  preferred = "top",
  offset = 8,
  margin = 8,
  axis = "both",
  flip = true,
  shift = true,
  overflow = false,
}) {
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  const positions = positionsByAxis[axis] || positionsByAxis.both;

  const floatingSize = getEffectiveSize(
    floatingRect,
    viewport,
    margin,
    overflow,
  );

  let placement = preferred;
  let coords = getCoordsByPlacement(
    preferred,
    targetRect,
    floatingSize,
    offset,
  );

  if (flip && !fitsInViewport(coords, floatingSize, viewport, margin)) {
    for (const pos of positions) {
      const next = getCoordsByPlacement(pos, targetRect, floatingSize, offset);

      if (fitsInViewport(next, floatingSize, viewport, margin)) {
        placement = pos;
        coords = next;
        break;
      }
    }
  }

  if (shift) {
    coords = applyShift(coords, floatingSize, viewport, margin, offset);
  }

  const { availableHeight, availableWidth } = getAvailableSpace(
    placement,
    targetRect,
    viewport,
    margin,
    offset,
  );

  return {
    ...coords,
    placement,
    availableHeight,
    availableWidth,
  };
}
