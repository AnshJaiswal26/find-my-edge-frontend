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

  toggleTheme: () =>
    set((prev) => {
      const isDark = prev.theme === "dark";
      const theme = isDark ? "light" : "dark";
      document.documentElement.classList.toggle("dark-theme", !isDark);
      localStorage.setItem("theme", theme);
      return { theme };
    }),

  isSidebarOpen: false,

  toggleSidebar: () =>
    set((prev) => {
      const value = !prev.isSidebarOpen;
      document.body.style.overflow = value ? "hidden" : "";
      document.documentElement.classList.toggle("sidebar-open", value);
      return { isSidebarOpen: value };
    }),

  username: "Ansh Jaiswal",
  setUserName: (username) => set({ username }),

  selectedAvatar: "Icons/avtar/user.png",
  setAvtar: (avtar) => set({ selectedAvatar: avtar }),

  activeSelector: null,
  setActiveSelector: (value) => set({ activeSelector: value }),
  toggleActiveSelector: (listId, buttonId) =>
    set((p) => ({
      activeSelector: p.activeSelector !== null ? null : { listId, buttonId },
    })),
}));
