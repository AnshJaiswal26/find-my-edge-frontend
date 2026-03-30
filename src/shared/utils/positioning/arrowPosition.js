export function getArrowBorderStyles(placement, border) {
  if (!border) return {};

  const borderMap = {
    top: {
      borderRight: border,
      borderBottom: border,
      borderLeft: "",
      borderTop: "",
    },
    bottom: {
      borderLeft: border,
      borderTop: border,
      borderRight: "",
      borderBottom: "",
    },
    left: {
      borderTop: border,
      borderRight: border,
      borderLeft: "",
      borderBottom: "",
    },
    right: {
      borderLeft: border,
      borderBottom: border,
      borderTop: "",
      borderRight: "",
    },
  };

  return borderMap[placement] || {};
}

export function getArrowPlacementStyles(placement) {
  const map = {
    top: {
      bottom: "0px",
      top: "",
      left: "50%",
      right: "",
      transform: "translate(-50%, 50%) rotate(45deg)",
    },
    bottom: {
      top: "0px",
      bottom: "",
      left: "50%",
      right: "",
      transform: "translate(-50%, -50%) rotate(45deg)",
    },
    left: {
      right: "0px",
      left: "",
      top: "50%",
      bottom: "",
      transform: "translate(50%, -50%) rotate(45deg)",
    },
    right: {
      left: "0px",
      right: "",
      top: "50%",
      bottom: "",
      transform: "translate(-50%, -50%) rotate(45deg)",
    },
  };

  return map[placement] || {};
}

export function ensureArrowElement(floatingEl) {
  let arrowEl = floatingEl.querySelector(".floating-with-arrow");

  if (!arrowEl) {
    arrowEl = document.createElement("div");
    arrowEl.className = "floating-with-arrow";
    floatingEl.appendChild(arrowEl);
  }

  return arrowEl;
}

export function applyArrowStyles(floatingEl, placement, arrow) {
  if (!arrow.show) return;

  const arrowEl = ensureArrowElement(floatingEl);
  const bgColor = getComputedStyle(floatingEl).backgroundColor;
  const border = arrow.style?.border;

  Object.assign(arrowEl.style, {
    backgroundColor: bgColor,
    ...(arrow.style || {}),
    ...getArrowPlacementStyles(placement),
    ...getArrowBorderStyles(placement, border),
  });
}
