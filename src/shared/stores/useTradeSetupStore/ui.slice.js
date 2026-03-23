import { moveItem } from "../../utils";

export const createUISlice = (set, get) => ({
  columnWidths: {
    "setup-1": [130, 150, 230, 130],
  },

  dragStartIndex: null,

  startRowDrag(index) {
    set({ dragStartIndex: index });
  },

  endRowDrag(index, setupId) {
    if (index === -1) return;
    const { dragStartIndex } = get();

    if (index === dragStartIndex) return;

    set((s) => {
      s.tradeSetupsById[setupId].fieldOrder = moveItem(
        s.tradeSetupsById[setupId].fieldOrder,
        dragStartIndex,
        index,
      );
    });
  },

  resizeStartIndex: null,

  startColumnResize(index) {
    set({ resizeStartIndex: index });
  },

  endColumnResize(width, index, setupId) {
    if (width === null || width === undefined) return;

    set((s) => {
      s.columnWidths[setupId][index] = width;
    });
  },

  // ------------ POPUPS ----------------
  activePopup: { activeSetupId: null, id: null },

  openPopup(id, setupId) {
    set((s) => {
      s.activePopup.id = id;
      s.activePopup.activeSetupId = setupId;
    });
  },

  closePopup() {
    set((s) => {
      s.activePopup.id = null;
      s.activePopup.activeSetupId = null;
    });
  },
});
