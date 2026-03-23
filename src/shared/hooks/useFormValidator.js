import { useRef, useState } from "react";

export function useFormValidator({ initialValues, rules }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const refs = useRef({}); // 🔥 field -> element map

  const register = (key) => (el) => {
    if (el) refs.current[key] = el;
  };

  const setField = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));

    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const scrollToError = (field) => {
    const el = refs.current[field];
    if (!el) return;

    el.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    // optional: focus
    if (el.focus) el.focus();
  };

  const validate = () => {
    const newErrors = {};

    for (let [field, validators] of Object.entries(rules)) {
      for (let validateFn of validators) {
        const err = validateFn(values[field], values);
        if (err) {
          newErrors[field] = err;

          // 🔥 scroll to FIRST error only
          if (Object.keys(newErrors).length === 1) {
            setTimeout(() => scrollToError(field), 0);
          }

          break;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    values,
    errors,
    setField,
    validate,
    register,
  };
}
