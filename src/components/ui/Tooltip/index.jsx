import styles from "./Tooltip.module.css";

export default function Tooltip({ data, position, isVisible, className }) {
  if (!data) return null;
  return (
    <div
      className={`${styles.container} ${styles[position]} ${
        isVisible ? styles.visible : ""
      } ${className}`}
    >
      <div className={styles.tooltipContent}>
        {data.map((item, idx) => (
          <div key={idx}>{item}</div>
        ))}
      </div>
      <div className={styles.arrow}></div>
    </div>
  );
}
