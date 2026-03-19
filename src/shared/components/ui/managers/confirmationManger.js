class ConfirmationManager {
  constructor() {
    this.current = null;
    this.listeners = new Set();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((l) => l(this.current));
  }

  confirm(config) {
    this.current = {
      mode: "blocking", // default
      loading: false,
      ...config,
      open: true,
    };

    this.notify();
  }

  async resolve(action) {
    if (!this.current) return;

    const { mode, onConfirm, onCancel, onError } = this.current;

    if (action === "cancel") {
      onCancel?.();
      this.current = null;
      this.notify();
      return;
    }

    if (mode === "optimistic") {
      // close immediately
      const task = onConfirm?.(); // don't await

      this.current = null;
      this.notify();

      // handle async errors silently or via toast
      if (task?.catch) {
        task.catch((e) => {
          onError?.(e);
        });
      }

      return;
    }

    try {
      this.current = {
        ...this.current,
        loading: true,
      };
      this.notify();

      await onConfirm?.();

      this.current = null;
      this.notify();
    } catch (e) {
      onError?.(e);
      // keep popup open, stop loading
      this.current = {
        ...this.current,
        loading: false,
      };
      this.notify();
    }
  }
}

export const confirmManager = new ConfirmationManager();
