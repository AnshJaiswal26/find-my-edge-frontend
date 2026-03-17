class DismissManager {
  constructor() {
    this.layers = new Set();

    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleVisibility = this.handleVisibility.bind(this);

    window.addEventListener("pointerdown", this.handlePointerDown);
    window.addEventListener("resize", this.handleResize);
    document.addEventListener("visibilitychange", this.handleVisibility);
  }

  register({ element, close }) {
    const layer = { element, close };
    this.layers.add(layer);

    return () => {
      this.layers.delete(layer);
    };
  }

  handlePointerDown(e) {
    const target = e.target;

    // iterate from last opened to first (top-most first)
    const layers = Array.from(this.layers);

    for (let i = layers.length - 1; i >= 0; i--) {
      const layer = layers[i];

      if (!layer.element || layer.element.contains(target)) {
        return;
      }

      layer.close();
    }
  }

  handleResize() {
    this.closeAll();
  }

  handleVisibility() {
    if (document.hidden) {
      this.closeAll();
    }
  }

  closeAll() {
    this.layers.forEach((layer) => layer.close());
  }
}

export const dismissManager = new DismissManager();
