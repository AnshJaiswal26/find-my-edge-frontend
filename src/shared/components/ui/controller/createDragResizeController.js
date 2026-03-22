export function createDragResizeController() {
  let ghostEl = null;
  let startRect = null;
  let bounds = null;

  let parentElRef = null;
  let parentScrollWidth = 0;
  let parentScrollHeight = 0;

  let prevOverflow = { x: "", y: "" };

  function start({ rect, parentRect, mode, parentEl, axis }) {
    ghostEl = document.createElement("div");

    startRect = rect;
    bounds = parentRect;
    parentElRef = parentEl;

    parentScrollWidth = parentEl.scrollWidth;
    parentScrollHeight = parentEl.scrollHeight;

    const scrollLeft = parentEl.scrollLeft;
    const scrollTop = parentEl.scrollTop;

    const left = rect.left - parentRect.left + scrollLeft;
    const top = rect.top - parentRect.top + scrollTop;

    ghostEl.style.position = "absolute";
    ghostEl.style.left = `${left}px`;
    ghostEl.style.top = `${top}px`;
    ghostEl.style.width = `${rect.width}px`;
    ghostEl.style.height = `${rect.height}px`;

    prevOverflow.x = parentElRef.style.overflowX;
    prevOverflow.y = parentElRef.style.overflowY;

    if (axis === "x") {
      ghostEl.style.top = `0px`;
      ghostEl.style.height = `${parentRect.height}px`;
      parentElRef.style.overflowY = "hidden";
    } else if (axis === "y") {
      ghostEl.style.left = `0px`;
      ghostEl.style.width = `${parentRect.width}px`;
      parentElRef.style.overflowX = "hidden";
    }

    if (mode === "resize") {
      ghostEl.style.borderRight = "2px dashed var(--cyan)";
    }

    ghostEl.style.pointerEvents = "none";
    ghostEl.style.zIndex = "9999";
    ghostEl.style.background = "var(--cyan-soft)";
    ghostEl.style.opacity = "50%";

    parentEl.appendChild(ghostEl);
  }

  function move(dx = 0, dy = 0, axis = "x") {
    if (!ghostEl || !startRect || !bounds || !parentElRef) return;

    let tx = dx;
    let ty = dy;

    if (axis === "x") ty = 0;
    if (axis === "y") tx = 0;

    const startLeft = startRect.left - bounds.left;
    const startTop = startRect.top - bounds.top;

    let newLeft = startLeft + tx;
    let newTop = startTop + ty;

    const maxX = parentElRef.scrollWidth - startRect.width;
    const maxY = parentElRef.scrollHeight - startRect.height;

    newLeft = Math.max(0, Math.min(newLeft, maxX));
    newTop = Math.max(0, Math.min(newTop, maxY));

    tx = newLeft - startLeft;
    ty = newTop - startTop;

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

    if (parentElRef) {
      parentElRef.style.overflowX = prevOverflow.x;
      parentElRef.style.overflowY = prevOverflow.y;
    }

    document.body.style.userSelect = "";
  }

  return { start, move, resize, end };
}
