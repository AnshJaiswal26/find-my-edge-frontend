export const createUISlice = (set) => ({
  activePopup: null,
  chartGridLayout: null,

  setLayout(layout) {
    set({ chartGridLayout: layout });
  },

  openPopup(id) {
    set({ activePopup: id });
  },

  closePopup() {
    set({ activePopup: null });
  },
});
