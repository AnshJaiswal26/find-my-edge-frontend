export function setArrowPosition(
  arrow,
  placement,
  anchorOffset,
  style,
  prevStyle,
) {
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
