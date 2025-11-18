import { useState } from "react";
import Tooltip from "../Tooltip";
import styles from "./Buttons.module.css";
import { useResolvedValue } from "@hooks";

export const Button = ({
  text,
  color,
  onClick,
  size = "medium",
  title,
  disabled = false,
  className,
}) => {
  return (
    <div className="flex">
      <button
        style={{ "--bg-color": color }}
        title={title}
        className={`${styles.button} ${styles[size]} ${
          disabled ? `${styles.disabled}` : ""
        } ${className}`}
        disabled={disabled}
        onClick={() => {
          if (!onClick) return;
          onClick();
        }}
      >
        <span>{text}</span>
      </button>
    </div>
  );
};

export const ToggleButton = ({
  label = "",
  value = false,
  color,
  onClick,
  bothSide = false,
  className,
  store,
}) => {
  const toggleOn = useResolvedValue(store, value);

  const toggleStyle = toggleOn
    ? { backgroundColor: color || "var(--color-default)" }
    : {};
  const borderColor = toggleOn ? color || "var(--color-default)" : "#cccccc";

  return (
    <div className={`${styles.toggleBtnContainer} ${className}`}>
      {label && <span className={styles.toggleBtnLabel}>{label}</span>}
      <div
        className={styles.toggleBtnTrack}
        style={toggleStyle}
        onClick={() => {
          if (!onClick) return;
          onClick();
        }}
      >
        <div
          className={`${styles.toggleBtnCircle} ${
            toggleOn ? styles.enable : ""
          }`}
          style={{ border: `1px solid ${borderColor}` }}
        />
      </div>
    </div>
  );
};

export const IconButton = ({
  onClick,
  icon,
  src,
  alt,
  className,
  disabled = false,
  tooltipContent,
  tooltipPosition = "top",
}) => {
  return (
    <div
      className="relative w-[fit-content]"
      data-tooltip-position={tooltipPosition}
      data-tooltip={tooltipContent}
    >
      <button
        className={`${styles.iconBtn} ${className} ${
          disabled
            ? "pointer-events-none text-[var(--color-text-disabled)]"
            : ""
        }`}
        onClick={(e) => (onClick ? onClick(e) : null)}
        disabled={disabled}
      >
        {icon ? icon : <img src={src} alt={alt ?? "icon button"} />}
      </button>
    </div>
  );
};
