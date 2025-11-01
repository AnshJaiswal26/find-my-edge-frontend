/* eslint-disable react-refresh/only-export-components */
import { create } from "zustand";

const getTheme = () => {
  const theme = localStorage.getItem("theme");
  if (theme)
    document.documentElement.classList.toggle("dark-theme", theme === "dark");

  return theme || "dark";
};

const getSidebarStatus = () => {
  const isSidebarOpen = localStorage.getItem("isSidebarOpen");

  if (isSidebarOpen)
    document.documentElement.classList.toggle("sidebar-open", isSidebarOpen);

  return isSidebarOpen !== undefined ? isSidebarOpen : false;
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
}));
