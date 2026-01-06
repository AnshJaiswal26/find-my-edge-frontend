export function createColumnDragController() {
  let ghostEl = null;

  function start({ rect, tableRect, mode }) {
    ghostEl = document.createElement("div");

    ghostEl.style.position = "fixed";
    ghostEl.style.top = `${tableRect.top}px`;
    ghostEl.style.left = `${rect.left}px`;
    ghostEl.style.height = `${tableRect.height}px`;
    ghostEl.style.width = `${rect.width}px`;

    ghostEl.style.pointerEvents = "none";
    ghostEl.style.zIndex = "9999";
    ghostEl.style.borderRadius = "4px";
    ghostEl.style.willChange = "transform, width";

    ghostEl.style.background = "var(--cyan-soft)";

    if (mode === "resize") {
      ghostEl.style.background = "var(--cyan-soft)";
      ghostEl.style.opacity = 60;
      ghostEl.style.borderRight = "4px solid var(--cyan)";
    }

    document.body.style.userSelect = "none";
    document.body.appendChild(ghostEl);
  }

  function move(deltaX) {
    if (!ghostEl) return;
    ghostEl.style.transform = `translateX(${deltaX}px)`;
  }

  function resize(width) {
    if (!ghostEl) return;
    ghostEl.style.width = `${width}px`;
  }

  function end() {
    ghostEl?.remove();
    ghostEl = null;
    document.body.style.userSelect = "";
  }

  return { start, move, resize, end };
}
