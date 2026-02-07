import { create } from "zustand";

export const useCalendarStore = create((set) => ({
  viewMode: "Month",
  currentDate: new Date(),
  selectedDate: new Date(),

  setViewMode: (viewMode) => set({ viewMode }),

  setCurrentDate: (date) => set({ currentDate: new Date(date) }),

  setSelectedDate: (date) => set({ selectedDate: new Date(date) }),
}));
