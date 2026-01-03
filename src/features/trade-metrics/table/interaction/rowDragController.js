// interaction/rowDragController.ts
export function createRowDragController() {
  let ghostEl = null;

  function start({ rect }) {
    ghostEl = document.createElement("div");
    ghostEl.style.position = "fixed";
    ghostEl.style.top = `${rect.top}px`;
    ghostEl.style.left = `${rect.left}px`;
    ghostEl.style.height = `${rect.height}px`;
    ghostEl.style.width = `${rect.width}px`;
    ghostEl.style.pointerEvents = "none";
    ghostEl.style.zIndex = 9999;
    ghostEl.style.background = "var(--cyan-soft)";

    document.body.style.userSelect = "none";
    document.body.appendChild(ghostEl);
  }

  function move(y) {
    if (!ghostEl) return;
    ghostEl.style.transform = `translateY(${y}px)`;
  }

  function end() {
    ghostEl?.remove();
    document.body.style.userSelect = "";
    ghostEl = null;
  }

  return { start, move, end };
}
