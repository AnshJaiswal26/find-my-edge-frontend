import { getUpdatedKeys, roundKeys } from "@features/risk-management/utils";

export const calculatorUpdater = ({ prev, section, updates, cfg }) => {
  const prevSection = prev[section];

  const roundedKeys = cfg.round ? roundKeys(updates) : updates;
  const toUpdate = getUpdatedKeys(prevSection, roundedKeys);

  if (Object.keys(toUpdate).length === 0) {
    return null;
  }

  const result = { ...prevSection, ...toUpdate };
  return { [section]: result };
};

// Tooltip updates
export const toolTipUpdater = ({ prev, section, updates }) => {
  if (section === "capitalTooltip" || section === "riskRewardTooltip") {
    return { [section]: updates };
  }

  const prevSec = prev[section];
  const diff = Object.entries(updates).reduce((acc, [f, val]) => {
    const prevField = prevSec[f];
    const changed =
      (prevField === null && val !== null) ||
      (prevField && val && prevField.key !== val.key) ||
      (prevField !== null && val === null);

    if (changed) acc[f] = val;
    return acc;
  }, {});

  if (Object.keys(diff).length === 0) {
    return null;
  }
  const hasActive = Object.values(diff).some((v) => v !== null);

  return { [section]: { ...prevSec, ...diff }, anyTooltipActive: hasActive };
};

export const singleUpdater = ({ prev, section, updates }) => {
  if (prev[section] === updates) return null;
  return { [section]: updates };
};

export const settingsUpdater = ({ prev, updates }) => {
  const prevSettings = prev.settings;
  const filtered = {};
  for (const key in updates) {
    if (prevSettings[key] === updates[key]) continue;
    filtered[key] = updates[key];
  }
  return { settings: { ...prevSettings, ...filtered } };
};
