import { TOAST } from "@shared/constants";
import { useUIStore } from "@shared/stores";

function show(type, message, duration) {
  useUIStore.getState().showToast(type, message, duration);
}

export const toast = {
  success: (msg, duration) => show(TOAST.SUCCESS, msg, duration),
  error: (msg, duration) => show(TOAST.ERROR, msg, duration),
  info: (msg, duration) => show(TOAST.INFO, msg, duration),
  warning: (msg, duration) => show(TOAST.WARNING, msg, duration),
};
