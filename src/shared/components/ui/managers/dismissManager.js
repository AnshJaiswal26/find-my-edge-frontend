class DismissManager {
  constructor() {
    this.listeners = new Map();

    this.handleEvent = this.handleEvent.bind(this);

    // register global events
    this.addGlobalListener("pointerdown");
    this.addGlobalListener("resize");
    this.addGlobalListener("scroll", { passive: true, capture: true });
    this.addGlobalListener("visibilitychange", { target: document });
  }

  addGlobalListener(event, options = {}) {
    const target = options.target || window;

    target.addEventListener(
      event,
      (e) => {
        // defer to avoid React ordering issues
        this.handleEvent(event, e);
      },
      options,
    );
  }

  handleEvent(event, e) {
    const handlers = this.listeners.get(event);
    if (!handlers) return;

    // copy to avoid mutation issues during iteration
    const queue = [...handlers];

    for (let i = queue.length - 1; i >= 0; i--) {
      queue[i](e);
    }
  }

  register(events, callback) {
    const eventList = Array.isArray(events) ? events : [events];

    // store references for cleanup
    const cleanups = [];

    for (const event of eventList) {
      if (!this.listeners.has(event)) {
        this.listeners.set(event, []);
      }

      const arr = this.listeners.get(event);
      arr.push(callback);

      cleanups.push(() => {
        const list = this.listeners.get(event);
        if (!list) return;

        const idx = list.indexOf(callback);
        if (idx !== -1) list.splice(idx, 1);
      });
    }

    // return single cleanup fn
    return () => {
      cleanups.forEach((fn) => fn());
    };
  }
}

export const dismissManager = new DismissManager();
