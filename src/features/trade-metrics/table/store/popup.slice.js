export const createPopupSlice = (set, get) => ({
  activePopup: null,

  /* ---------------------------------------------------------------------- */
  /*                             POPUP ACTIONS                              */
  /* ---------------------------------------------------------------------- */

  openPopup(id) {
    set({ activePopup: id });
  },

  closePopup() {
    set({ activePopup: null });
  },
});
