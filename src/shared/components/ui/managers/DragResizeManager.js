function getDragRects(ele, att) {
  return Array.from(ele.querySelectorAll(att)).map((el, index) => {
    const r = el.getBoundingClientRect();
    return {
      index,
      left: r.left,
      right: r.right,
      top: r.top,
      bottom: r.bottom,
    };
  });
}

function findDragIndex(rects, x, y, mode) {
  let low = 0;
  let high = rects.length - 1;

  while (low <= high) {
    let mid = (low + high) >> 1;
    const target = rects[mid];

    if (mode === "x") {
      if (x < target.left) {
        high = mid - 1;
      } else if (x > target.right) {
        low = mid + 1;
      } else {
        return target.index;
      }
    } else {
      if (y < target.top) {
        high = mid - 1;
      } else if (y > target.bottom) {
        low = mid + 1;
      } else {
        return target.index;
      }
    }
  }

  return -1;
}

export class DragResizeManager {
  constructor({
    parentRef,
    controllerFactory,
    mode = "x", // "x" | "y" | "both"

    onDragStart,
    onDragMove,
    onDragEnd,

    onResizeStart,
    onResizeMove,
    onResizeEnd,
  }) {
    this.parentRef = parentRef;
    this.controller = controllerFactory?.();
    this.mode = mode;
    this.dragRects = null;

    this.callbacks = {
      onDragStart,
      onDragMove,
      onDragEnd,
      onResizeStart,
      onResizeMove,
      onResizeEnd,
    };

    this.session = null;
  }

  cleanup() {
    if (!this.session) return;

    window.removeEventListener("pointermove", this.session.onMove);
    window.removeEventListener("pointerup", this.session.onUp);

    this.controller?.end?.();

    this.session = null;
  }

  // ================= DRAG =================
  startDrag(e, element, direction, extra = {}) {
    e.preventDefault();
    this.cleanup();

    const rect = element.getBoundingClientRect();
    const parentRect = this.parentRef?.current?.getBoundingClientRect();

    const session = {
      type: "drag",
      startX: e.clientX,
      startY: e.clientY,
      rect,
      parentRect,
      ...extra,
    };

    this.session = session;

    this.controller?.start?.({
      rect,
      parentRect,
      mode: "reorder",
      axis: this.mode,
      direction,
      parentEl: this.parentRef.current,
    });

    this.dragRects = getDragRects(
      this.parentRef?.current,
      this.mode === "x" ? "[data-col-header]" : "[data-row-header]",
    );

    this.callbacks.onDragStart?.(session);

    let lastIndex = -1;

    session.onMove = (ev) => {
      const clientX = ev.clientX;
      const clientY = ev.clientY;

      let dx = clientX - session.startX;
      let dy = clientY - session.startY;

      if (this.mode === "x") dy = 0;
      if (this.mode === "y") dx = 0;

      this.controller?.move?.(dx, dy, this.mode, parentRect);

      const index = findDragIndex(this.dragRects, clientX, clientY, this.mode);
      const prevIndex = lastIndex;
      lastIndex = index;

      this.callbacks.onDragMove?.({
        dx,
        dy,
        clientX,
        clientY,
        index,
        dragElRect: this.dragRects[index],
        lastIndex: prevIndex,
        ...session,
      });
    };

    session.onUp = (ev) => {
      this.callbacks.onDragEnd?.({
        clientX: ev.clientX,
        clientY: ev.clientY,
        lastIndex,
        ...session,
      });

      this.cleanup();
    };

    window.addEventListener("pointermove", session.onMove);
    window.addEventListener("pointerup", session.onUp);
  }

  // ================= RESIZE =================
  startResize(e, element, direction = "right", extra = {}) {
    e.preventDefault();
    this.cleanup();

    const rect = element.getBoundingClientRect();
    const parentRect = this.parentRef?.current?.getBoundingClientRect();

    const session = {
      type: "resize",
      startX: e.clientX,
      startY: e.clientY,
      startWidth: rect.width,
      startHeight: rect.height,
      rect,
      parentRect,
      direction,
      ...extra,
    };

    this.session = session;

    this.controller?.start?.({
      rect,
      parentRect,
      mode: "resize",
      axis: this.mode,
      direction,
      parentEl: this.parentRef.current,
    });

    this.callbacks.onResizeStart?.(session);

    session.onMove = (ev) => {
      const clientX = ev.clientX;
      const clientY = ev.clientY;

      const dx = clientX - session.startX;
      const dy = clientY - session.startY;

      let width = session.startWidth;
      let height = session.startHeight;

      if (direction.includes("right")) width += dx;
      if (direction.includes("left")) width -= dx;
      if (direction.includes("bottom")) height += dy;
      if (direction.includes("top")) height -= dy;

      width = Math.max(40, width);
      height = Math.max(40, height);

      // ✅ correct controller API
      this.controller?.resize?.({ width, height, axis: this.mode });

      this.callbacks.onResizeMove?.({
        width,
        height,
        dx,
        dy,
        clientX,
        clientY,
        ...session,
      });
    };

    session.onUp = (ev) => {
      const dx = ev.clientX - session.startX;
      const dy = ev.clientY - session.startY;

      let width = session.startWidth;
      let height = session.startHeight;

      if (direction.includes("right")) width += dx;
      if (direction.includes("left")) width -= dx;
      if (direction.includes("bottom")) height += dy;
      if (direction.includes("top")) height -= dy;

      width = Math.max(40, width);
      height = Math.max(40, height);

      this.callbacks.onResizeEnd?.({
        width,
        height,
        ...session,
      });

      this.cleanup();
    };

    window.addEventListener("pointermove", session.onMove);
    window.addEventListener("pointerup", session.onUp);
  }
}
