export const createSelectionSlice = (set, get) => ({
  selectedColumn: null,
  selectedRow: null,

  /* ---------------------------------------------------------------------- */
  /*                             SELECTION ACTIONS                          */
  /* ---------------------------------------------------------------------- */

  selectColumn(payload) {
    set({
      selectedColumn: {
        id: payload.id,
        width: payload.width,
        left: payload.left,
      },
      colDragMode: "select",
    });
  },

  unselectColumn(payload) {
    if (payload?.id === get().selectedColumn?.id) return;
    set({ selectedColumn: null, colDragMode: null });
  },
});
