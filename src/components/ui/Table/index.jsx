import styles from "./Table.module.css";

export default function Table({ tableHead, tableBody }) {
  const flatTable = tableBody.flatMap((list) => list);
  const colLength = tableHead.length;

  console.log(colLength);

  return (
    <div className={styles.tableWrapper} style={{ "--col-length": colLength }}>
      <div className={styles.tableGrid}>
        {tableHead.map((cell, index) => (
          <div
            className={`${styles.tableCell} ${styles.headerCell}`}
            key={index}
          >
            <span>{cell}</span>
          </div>
        ))}
        {flatTable.map((cell, index) => (
          <div className={styles.tableCell} key={index}>
            <span>{cell}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
