import { useEffect, useState } from "react";
import { parseInputValue, formatForInput } from "@utils";

/* =========================================================
 * BASE STYLES
 * ========================================================= */

const BASE_CLASS = `
  w-full rounded
  bg-(--surface-muted)
  text-(--text)
  border border-(--border)
  outline-none focus:border-(--info)
  disabled:opacity-50 disabled:cursor-not-allowed
  [appearance:textfield]
  [&::-webkit-outer-spin-button]:appearance-none
  [&::-webkit-inner-spin-button]:appearance-none
`;

/* =========================================================
 * SIZE CONFIG
 * ========================================================= */

const sizeClasses = {
  sm: {
    input: "h-7 px-2 text-xs",
    label: "text-xs",
  },
  md: {
    input: "h-8 px-2 text-sm",
    label: "text-sm",
  },
  lg: {
    input: "h-9 px-3 text-base",
    label: "text-base",
  },
};

/* =========================================================
 * UTILS
 * ========================================================= */

const clamp = (n, min, max) =>
  Number.isNaN(n) || n == null ? 0 : Math.min(Math.max(n, min), max);

const toParts = (seconds = 0) => ({
  h: Math.floor(seconds / 3600),
  m: Math.floor((seconds % 3600) / 60),
  s: seconds % 60,
});

const toSeconds = ({ h, m, s }) => h * 3600 + m * 60 + s;
const pad2 = (n) => (n === 0 ? "" : String(n).padStart(2, "0"));

/* =========================================================
 * DURATION INPUT (time computed)
 * ========================================================= */

function DurationInput({ value = 0, sizes, onChange, onCommit, classNames }) {
  const commitMode = typeof onCommit === "function";
  const [local, setLocal] = useState(toParts(value));

  useEffect(() => {
    setLocal(toParts(value));
  }, [value]);

  const update = (e, next) => {
    // Convert current + edited values into total seconds
    const totalSeconds =
      (next.h ?? 0) * 3600 + (next.m ?? 0) * 60 + (next.s ?? 0);

    // Optional hard limits
    const clampedSeconds = Math.max(0, totalSeconds);

    // Normalize back into h:m:s
    const normalized = toParts(clampedSeconds);

    commitMode ? setLocal(normalized) : onChange?.(e, clampedSeconds);
  };

  const commit = () => {
    onCommit?.(toSeconds(local));
  };

  const inputClass = `
    ${BASE_CLASS}
    border-0!
    max-w-10! min-w-5!
    text-center p-1!
    ${sizes?.input}
  `;

  return (
    <div
      className={`
        flex items-center gap-1
        border border-(--border) rounded
        focus-within:border-(--info)
        ${classNames?.input}
      `}
    >
      <input
        type="number"
        value={pad2(local.h)}
        placeholder="hh"
        className={inputClass}
        onChange={(e) => update(e, { ...local, h: Number(e.target.value) })}
        onBlur={commit}
      />
      :
      <input
        type="number"
        value={pad2(local.m)}
        placeholder="mm"
        className={inputClass}
        onChange={(e) => update(e, { ...local, m: Number(e.target.value) })}
        onBlur={commit}
      />
      :
      <input
        type="number"
        value={pad2(local.s)}
        placeholder="ss"
        className={inputClass}
        onChange={(e) => update(e, { ...local, s: Number(e.target.value) })}
        onBlur={commit}
      />
    </div>
  );
}

/* =========================================================
 * STANDARD INPUT
 * ========================================================= */

function InputField({
  type = "text",
  value,
  normalize = false,
  sizes,
  onChange,
  onCommit,
  onBlur,
  classNames,
  ...props
}) {
  const commitMode = typeof onCommit === "function";
  const [local, setLocal] = useState(value);

  useEffect(() => {
    if (commitMode) setLocal(value);
  }, [value, commitMode]);

  const rawValue = commitMode ? local : value;

  const displayValue = normalize
    ? formatForInput(rawValue, type)
    : (rawValue ?? "");

  const handleChange = (e) => {
    const parsed = normalize
      ? parseInputValue(e.target.value, type)
      : e.target.value;

    commitMode ? setLocal(parsed) : onChange?.(e, parsed);
  };

  const handleBlur = (e) => {
    if (commitMode) onCommit?.(local);
    onBlur?.(e);
  };

  return (
    <input
      {...props}
      type={type}
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      className={`
        ${BASE_CLASS}
        max-w-40 min-w-30
        ${sizes?.input}
        ${classNames?.input}
      `}
    />
  );
}

/* =========================================================
 * MAIN INPUT WRAPPER
 * ========================================================= */

export default function Input({
  size = "md",
  type = "text",
  value,
  label,
  vertical = false,
  normalize = false,
  onChange,
  onCommit,
  onBlur,
  classNames,
  ...props
}) {
  const sizes = sizeClasses[size];
  const Component = type === "time computed" ? DurationInput : InputField;

  return (
    <div
      className={`flex items-center gap-1 flex-wrap text-sm ${
        classNames?.wrapper
      } ${vertical ? "flex-col gap-1!" : ""}`}
    >
      {label && (
        <label
          className={`shrink-0 w-32 ${vertical ? "self-start" : ""} ${
            sizes?.label
          }`}
        >
          {label}
        </label>
      )}

      <div
        className={`flex flex-1 gap-1 w-full justify-start sm:justify-end ${
          classNames?.inputWrapper
        } ${vertical ? "justify-start!" : ""}`}
      >
        <Component
          value={value}
          sizes={sizes}
          type={type}
          normalize={normalize}
          onChange={onChange}
          onCommit={onCommit}
          onBlur={onBlur}
          classNames={classNames}
          {...props}
        />
      </div>
    </div>
  );
}
