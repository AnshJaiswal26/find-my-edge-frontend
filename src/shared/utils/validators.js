import { isBetween } from "./filters";

const required =
  (msg = "Required") =>
  (value) =>
    value === "" || value == null ? msg : null;

const requiredIf =
  (condition, msg = "Required") =>
  (value, form) =>
    condition(form) && (value === "" || value == null) ? msg : null;

const rangeRequired =
  (msg = "Range required") =>
  (value, form) => {
    if (!form.condition) return null;
    if (isBetween(form.condition)) {
      if (form.from === "" || form.to === "") return msg;
    }
    return null;
  };

export { required, requiredIf, rangeRequired };
