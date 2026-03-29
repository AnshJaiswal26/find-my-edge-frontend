import {
  calculatorUpdater,
  settingsUpdater,
  singleUpdater,
  toolTipUpdater,
} from "@features/risk-management/utils";

const updaterMap = {
  "single-value": singleUpdater,
  calculator: calculatorUpdater,
  tooltip: toolTipUpdater,
  settings: settingsUpdater,
};

function applySectionUpdate(set, prev, sectionUpdates, cfg) {
  const stateUpdates = {};
  for (const update of sectionUpdates) {
    if (update.length !== 3) continue;
    const [type, section, updates] = update;
    const updater = updaterMap[type];
    if (!update) continue;

    const result = updater({ set, prev, section, updates, cfg });
    if (result === null) continue;
    for (const key in result) {
      stateUpdates[key] = result[key];
    }
  }
  return Object.keys(stateUpdates).length === 0 ? prev : stateUpdates;
}

export const createUpdaterSlice = (set) => ({
  updater: {
    hoveredInput: (val) =>
      set(
        (prev) =>
          singleUpdater({ prev, section: "hoveredInput", updates: val }) ||
          prev,
      ),

    tab: (val) =>
      set(
        (prev) =>
          singleUpdater({ prev, section: "currentTab", updates: val }) || prev,
      ),

    transaction: (val) =>
      set(
        (prev) =>
          singleUpdater({
            prev,
            section: "currentTransaction",
            updates: val,
          }) || prev,
      ),

    field: (name, val) =>
      set(
        (prev) => singleUpdater({ prev, section: name, updates: val }) || prev,
      ),

    tooltip: (section, updates) =>
      set((prev) => toolTipUpdater({ prev, section, updates })),

    settings: (updates) => set((prev) => settingsUpdater({ prev, updates })),

    section: (section, updates, cfg = { round: true }) => {
      set((prev) => {
        const data = calculatorUpdater({ prev, section, updates, cfg });
        return Object.keys(data).length === 0 ? prev : data;
      });
    },

    sections: (sectionUpdates, cfg = { round: true }) => {
      set((prev) => applySectionUpdate(set, prev, sectionUpdates, cfg));
    },
  },
});
