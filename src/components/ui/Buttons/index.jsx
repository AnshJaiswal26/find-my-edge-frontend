import styles from "./Buttons.module.css";

export const Button = ({ text, color, onClick, style, title }) => {
  if (!text || typeof text !== "string")
    console.error("Text must be a non-empty string");

  const buttonStyle = {
    ...(color ? { backgroundColor: color } : {}),
    ...(style ? style : {}),
  };

  return (
    <div>
      <button
        style={buttonStyle}
        title={title}
        className={style?.disabled ? `${styles.disabled}` : styles.button}
        disabled={style?.disabled}
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

export const IconButton = ({ onClick, icon, src, alt, className }) => {
  return (
    <div>
      <button
        className={`${styles.iconBtn} ${className}`}
        onClick={() => onClick()}
      >
        {icon ? icon : <img src={src} alt={alt ?? "icon button"} />}
      </button>
    </div>
  );
};
