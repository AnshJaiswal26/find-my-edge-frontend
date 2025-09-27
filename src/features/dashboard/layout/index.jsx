import styles from "./layout.module.css";

export const DashboardStatsGrid = ({ children, className }) => {
  return (
    <div className={`${styles.statCardGrid} ${className}`}>{children}</div>
  );
};
