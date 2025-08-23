import styles from "./Label.module.css";
export default function Label({ children, type = "medium" }) {
  return <div className={`${styles.label} ${styles[type]}`}>{children}</div>;
}
