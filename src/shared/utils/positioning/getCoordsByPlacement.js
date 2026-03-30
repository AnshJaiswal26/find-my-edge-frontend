export function getCoordsByPlacement(
  placement,
  targetRect,
  floatingSize,
  offset,
) {
  const { width, height } = floatingSize;

  switch (placement) {
    case "top":
      return {
        top: targetRect.top - height - offset,
        left: targetRect.left + targetRect.width / 2 - width / 2,
      };

    case "bottom":
      return {
        top: targetRect.bottom + offset,
        left: targetRect.left + targetRect.width / 2 - width / 2,
      };

    case "left":
      return {
        top: targetRect.top + targetRect.height / 2 - height / 2,
        left: targetRect.left - width - offset,
      };

    case "right":
      return {
        top: targetRect.top + targetRect.height / 2 - height / 2,
        left: targetRect.right + offset,
      };
  }
}
