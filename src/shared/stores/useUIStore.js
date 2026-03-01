/* eslint-disable react-refresh/only-export-components */
import { create } from "zustand";

const getTheme = () => {
  const theme = localStorage.getItem("theme") || "dark-1";
  document.documentElement.setAttribute("data-theme", theme);
  return theme;
};

export const useUIStore = create((set) => ({
  theme: getTheme(),
  isSidebarOpen: false,
  username: "Ansh Jaiswal",
  selectedAvatar: "Icons/avtar/user.png",
  pageName: "Dashboard",
  activeSelect: null,
  activeColorPicker: false,
  toasts: [],

  loading: false,

  recentColors: [],

  tooltip: {
    color: null,
    visible: false,
    rect: null,
    content: null,
    placement: null,
  },

  setLoading(loading) {
    set({ loading });
  },

  setPageName(pageName) {
    set({ pageName });
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

  setTheme: (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    set({ theme });
  },

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

  addRecentColor: (color) =>
    set((state) => {
      const now = Date.now();
      const list = [...state.recentColors];
      const idx = list.findIndex((c) => c.color === color);

      if (idx !== -1) {
        list[idx] = {
          ...list[idx],
          count: list[idx].count + 1,
          lastUsed: now,
        };
      } else {
        list.push({ color, count: 1, lastUsed: now });
      }

      list.sort((a, b) => b.count - a.count || b.lastUsed - a.lastUsed);

      return { recentColors: list.slice(0, 10) };
    }),

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
        type === "ERROR" || type === "INFO" ? duration : 1500,
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
