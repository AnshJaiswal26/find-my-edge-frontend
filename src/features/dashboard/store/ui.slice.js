import { dashboardService } from "../services/dashboard.service";

export const createUISlice = (set) => ({
  activePopup: null,
  gridLayout: null,

  setLayout(layout) {
    set((s) => {
      s.gridLayout = { ...s.gridLayout, ...layout };
    });
    dashboardService.updateGridLayout(layout);
  },

  openPopup(id) {
    set({ activePopup: id });
  },

  closePopup() {
    set({ activePopup: null });
  },
});
