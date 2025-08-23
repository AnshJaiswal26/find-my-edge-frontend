import {
  getUpdatedKeys,
  logMsg,
  logObj,
  logResult,
  logStart,
  logStateUpdate,
  roundKeys,
} from "@RM/utils";

const flashTimeoutMap = new Map();

const handleFlash = (sec, set, prev, toReset, toFlash, duration) => {
  const key = `${sec}Flash`;
  const existingTimeout = flashTimeoutMap.get(key);
  if (existingTimeout) {
    logMsg(`(triggerFlash): Flash skipped for ${sec} (already active)`);
    return;
  }
  // Reset
  const timeout = setTimeout(() => {
    logStateUpdate(`Flash reset for ${key}`, toReset);
    set((prev) => ({ [key]: { ...prev[key], ...toReset } }));
    flashTimeoutMap.delete(key);
  }, duration);
  flashTimeoutMap.set(key, timeout);

  return { [key]: { ...prev[key], ...toFlash } };
};

export const calculatorUpdater = ({ set, prev, section, updates, cfg }) => {
  const { round, flashing, duration } = cfg;
  logStart("calculatorUpdater", { section, cfg });

  const prevSection = prev[section];
  const prevTooltip = prev[section + "Tooltip"];

  logObj("updates", updates);
  const roundedKeys = round ? roundKeys(updates) : updates;
  const { toUpdate, toFlash, toReset } = getUpdatedKeys(
    prevSection,
    roundedKeys,
    prevTooltip
  );

  if (Object.keys(toUpdate).length === 0) {
    logResult("calculatorUpdater", `No update needed for ${section}`);
    return null;
  }

  const shouldFlash = flashing && Object.keys(toFlash).length > 0;
  logStateUpdate(
    `Keys ${shouldFlash ? "& Flash " : ""}updated for ${section}`,
    {
      toUpdate,
      ...(shouldFlash && { toFlash: toFlash }),
    }
  );

  const result = { ...prevSection, ...toUpdate };
  logResult("calculatorUpdater", toUpdate);
  return {
    [section]: result,
    ...(shouldFlash &&
      handleFlash(section, set, prev, toReset, toFlash, duration)),
  };
};

// Tooltip updates
export const toolTipUpdater = ({ prev, section, updates }) => {
  logStart("tooltipUpdater", { section, updates }, false);
  if (section === "capitalTooltip" || section === "riskRewardTooltip") {
    logStateUpdate(`Tooltip set for ${section}`, updates);
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
    logResult("toolTipUpdater", "No Update Required.");
    return null;
  }
  const hasActive = Object.values(diff).some((v) => v !== null);

  logResult("toolTipUpdater", "Process Done");
  logStateUpdate(`Tooltip set for ${section}`, diff);
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
