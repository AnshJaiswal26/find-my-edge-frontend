import styles from "./StatCard.module.css";

export default function StatCard({ iconSrc, title, value, icon }) {
  return (
    <div className={styles.statCard}>
      {icon ? icon : <img className={styles.icon} src={iconSrc} alt={title} />}
      <div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.value}>{value}</p>
      </div>
    </div>
  );
}
