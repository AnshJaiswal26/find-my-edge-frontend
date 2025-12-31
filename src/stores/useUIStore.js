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
  activeSelect: null,
  activeColorPicker: false,
  toasts: [],

  tooltip: {
    color: null,
    visible: false,
    rect: null,
    content: null,
    placement: null,
  },

  showTooltip: ({ rect, color, placement, content }) => {
    set({
      tooltip: {
        visible: true,
        color,
        rect: rect
          ? {
              left: rect.left,
              top: rect.top,
              width: rect.width,
              height: rect.height,
            }
          : null,
        content,
        placement,
      },
    });
  },

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

  setSelect: (payload) => set({ activeSelect: payload }),

  toggleSelect: (payload) =>
    set((s) => ({
      activeSelect: s.activeSelect?.id === payload?.id ? null : payload,
    })),

  setColorPicker: (payload) =>
    set((s) => ({
      activeColorPicker:
        s.activeColorPicker?.id === payload?.id ? null : payload,
    })),

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
