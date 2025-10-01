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
        }`}
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
  label,
  toggleOn,
  color,
  onClick,
  bothSide = false,
  style,
}) => {
  if (toggleOn !== null && toggleOn !== undefined) {
    const toggleStyle =
      toggleOn || bothSide ? { backgroundColor: color ?? "#007bff" } : {};
    const borderColor = toggleOn || bothSide ? color ?? "#007bff" : "#cccccc";

    return (
      <div className={styles.toggleBtnContainer} style={style}>
        {label?.[0] && (
          <span className={styles.toggleBtnLabel}>{label[0]}</span>
        )}
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
              toggleOn ? styles.toggleBtnEnable : ""
            }`}
            style={{ border: `1px solid ${borderColor}` }}
          />
        </div>
        {label?.[1] && (
          <span className={styles.toggleBtnLabel}>{label[1]}</span>
        )}
      </div>
    );
  }
};

export const IconButton = ({
  onClick,
  icon,
  src,
  alt,
  tooltip = { title: "", position: "top" },
  className,
}) => {
  const [onHover, setOnHover] = useState(false);
  return (
    <div className="relative">
      <button
        className={`${styles.iconBtn} ${className}`}
        onClick={() => (onClick ? onClick() : null)}
        onMouseEnter={() => {
          if (tooltip) setOnHover(true);
        }}
        onMouseLeave={() => {
          if (tooltip) setOnHover(false);
        }}
      >
        {icon ? icon : <img src={src} alt={alt ?? "icon button"} />}
      </button>
      {tooltip.title && (
        <Tooltip
          data={[tooltip.title]}
          isVisible={onHover}
          position={tooltip.position}
        />
      )}
    </div>
  );
};
