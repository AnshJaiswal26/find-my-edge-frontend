export const createPopupSlice = (set, get) => ({
  activePopup: null,

  /* ------------------------------------- */
  /*           POPUP ACTIONS               */
  /* ------------------------------------- */

  openPopup(chartId, id) {
    set({ activePopup: { chartId, id } });
    // document.body.style.overflow = "hidden";
  },

  closePopup() {
    set({ activePopup: null });
    // document.body.style.overflow = "";
  },
});
