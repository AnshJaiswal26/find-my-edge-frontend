import { useState } from "react";
import Tooltip from "../Tooltip";
import styles from "./Buttons.module.css";

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
  selector = false,
  color,
  onClick,
  bothSide = false,
  className,
  store,
}) => {
  const toggleOn =
    store && typeof selector === "function" ? store(selector) : selector;

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
  tooltip = { title: "", position: "top", className: "" },
  className,
  disabled = false,
}) => {
  const [onHover, setOnHover] = useState(false);
  return (
    <div className="relative">
      <button
        className={`${styles.iconBtn} ${className} ${
          disabled
            ? "pointer-events-none text-[var(--color-text-disabled)]"
            : ""
        }`}
        onClick={(e) => (onClick ? onClick(e) : null)}
        onMouseEnter={() => {
          if (tooltip?.title !== "") setOnHover(true);
        }}
        onMouseLeave={() => {
          if (tooltip?.title !== "") setOnHover(false);
        }}
        disabled={disabled}
      >
        {icon ? icon : <img src={src} alt={alt ?? "icon button"} />}
      </button>
      {tooltip.title !== "" && (
        <Tooltip
          data={[tooltip.title]}
          isVisible={onHover}
          position={tooltip.position}
          className={`pl-2 pr-2 ${tooltip.className}`}
        />
      )}
    </div>
  );
};
