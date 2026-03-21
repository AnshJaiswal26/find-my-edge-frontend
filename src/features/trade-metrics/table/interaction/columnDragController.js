export function createColumnDragController() {
  let ghostEl = null;

  function start({ rect, parentRect, mode, direction = "right" }) {
    ghostEl = document.createElement("div");

    ghostEl.style.position = "fixed";
    ghostEl.style.top = `${rect.top}px`;
    ghostEl.style.left = `${rect.left}px`;
    ghostEl.style.width = `${rect.width}px`;
    ghostEl.style.height = `${rect.height}px`;

    if (parentRect) {
      ghostEl.style.top = `${parentRect.top}px`;
      ghostEl.style.height = `${parentRect.height}px`;
    }

    ghostEl.style.pointerEvents = "none";
    ghostEl.style.zIndex = "9999";
    ghostEl.style.borderRadius = "4px";
    ghostEl.style.willChange = "transform, width, height";

    ghostEl.style.background = "var(--cyan-soft)";

    if (mode === "resize") {
      ghostEl.style.opacity = "0.6";

      if (direction.includes("right"))
        ghostEl.style.borderRight = "4px solid var(--cyan)";
      if (direction.includes("left"))
        ghostEl.style.borderLeft = "4px solid var(--cyan)";
      if (direction.includes("bottom"))
        ghostEl.style.borderBottom = "4px solid var(--cyan)";
      if (direction.includes("top"))
        ghostEl.style.borderTop = "4px solid var(--cyan)";
    }

    document.body.style.userSelect = "none";
    document.body.appendChild(ghostEl);
  }

  function move(dx = 0, dy = 0, axis = "x") {
    if (!ghostEl) return;

    let tx = 0;
    let ty = 0;

    if (axis === "x") tx = dx;
    else if (axis === "y") ty = dy;
    else {
      tx = dx;
      ty = dy;
    }

    ghostEl.style.transform = `translate(${tx}px, ${ty}px)`;
  }

  function resize({ width, height, axis }) {
    if (!ghostEl) return;

    if (axis === "x") {
      ghostEl.style.width = `${width}px`;
    }

    if (axis === "y") {
      ghostEl.style.height = `${height}px`;
    }
  }

  function end() {
    ghostEl?.remove();
    ghostEl = null;
    document.body.style.userSelect = "";
  }

  return { start, move, resize, end };
}
