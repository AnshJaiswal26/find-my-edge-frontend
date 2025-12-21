/* eslint-disable react-refresh/only-export-components */
import { create } from "zustand";

const getTheme = () => {
  const theme = localStorage.getItem("theme");
  if (theme)
    document.documentElement.classList.toggle("dark-theme", theme === "dark");

  return theme || "dark";
};

export const useUIStore = create((set) => ({
  theme: getTheme(),
  isSidebarOpen: false,
  username: "Ansh Jaiswal",
  selectedAvatar: "Icons/avtar/user.png",
  activeSelector: null,
  toasts: [],

  toggleTheme: () =>
    set((prev) => {
      const isDark = prev.theme === "dark";
      const theme = isDark ? "light" : "dark";
      document.documentElement.classList.toggle("dark-theme", !isDark);
      localStorage.setItem("theme", theme);
      return { theme };
    }),

  toggleSidebar: () =>
    set((prev) => {
      const value = !prev.isSidebarOpen;
      document.body.style.overflow = value ? "hidden" : "";
      document.documentElement.classList.toggle("sidebar-open", value);
      return { isSidebarOpen: value };
    }),

  setUserName: (username) => set({ username }),

  setAvtar: (avtar) => set({ selectedAvatar: avtar }),

  setActiveSelector: (payload) => set({ activeSelector: payload }),

  showToast: (type = "INFO", message, duration = 5000) => {
    const id = Date.now() + Math.random();

    set((state) => {
      const newToast = { id, type: type.toLowerCase(), message };

      // auto-remove
      setTimeout(
        () => {
          set((s) => ({
            toasts: s.toasts.filter((t) => t.id !== id),
          }));
        },
        type === "ERROR" || type === "INFO" ? duration : 1500
      );

      return { toasts: [newToast, ...state.toasts] };
    });
    return id;
  },

  removeToast: (id) =>
    set((s) => ({
      toasts: id === "reset" ? [] : s.toasts.filter((t) => t.id !== id),
    })),
}));
