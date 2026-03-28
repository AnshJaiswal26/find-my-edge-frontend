import { logResult, logStart } from ".";

export const resolvePts = (name, pts, newPts) => {
  logStart("getCalculatedPts");

  const ptsBySec = (() => {
    switch (name) {
      case "calculator":
        return newPts;
      case "target":
        return newPts < 0 ? pts : newPts;
      default:
        return newPts > 0 ? pts : newPts;
    }
  })();

  logResult("getDerivedObj", ptsBySec);
  return ptsBySec;
};

export const getValBySecName = (s, v) =>
  s === "target" ? Math.abs(v) : s === "stopLoss" ? -Math.abs(v) : v;

export const resetAllToZero = (keys) => {
  logStart("resetAllToZero", { keys });

  const updatedToZero = keys.reduce((acc, key) => {
    acc[key] = 0;
    return acc;
  }, {});

  logResult("resetAllToZero", updatedToZero);
  return updatedToZero;
};

export const getUpdatedKeys = (prev, updates) => {
  const toUpdate = Object.keys(updates).reduce((acc, key) => {
    const newVal = updates[key];
    if (newVal !== prev[key]) {
      acc[key] = newVal;
    }
    return acc;
  }, {});

  return toUpdate;
};
