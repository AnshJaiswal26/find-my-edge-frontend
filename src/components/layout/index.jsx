import { Editor, Sidebar } from "@ui";
import styles from "./layout.module.css";

export function PageContainer({
  children,
  className = "",
  editor = true,
  sidebar = true,
  pageActive,
}) {
  return (
    <div>
      {editor && <Editor />}
      {sidebar && <Sidebar pageActive={pageActive} />}
      <div className={`${styles.pageContainer} ${className}`}>
        <div className={styles.mainContent}>{children}</div>
      </div>
    </div>
  );
}

export function Container({ children, className = "", title }) {
  return (
    <div className={`${styles.container} ${className}`}>
      <div className={`${styles.innerContainer} ${className}`}>
        {title && <div className={styles.title}>{title}</div>}
        <div className={styles.childrenWrapper}> {children}</div>
      </div>
    </div>
  );
}

export function Label({ children, type = "medium" }) {
  return <div className={`${styles.label} ${styles[type]}`}>{children}</div>;
}

export function Legend({ color, label }) {
  return (
    <div className={styles.legendWrapper}>
      <div className={styles.legendIndicatorLabelWrapper}>
        <div
          className={styles.legendIndicator}
          style={{ backgroundColor: color }}
        ></div>
        <span> {label}</span>
      </div>
    </div>
  );
}

export function Bar({ color, label1, label2, fill }) {
  return (
    <div className={styles.barContainer}>
      <div className={styles.barLabelsWrapper}>
        {label1 && (
          <div>
            <span>{label1}</span>
          </div>
        )}
        {label2 && (
          <div>
            <span>{label2} </span>
          </div>
        )}
      </div>

      <div className={styles.bar}>
        <div
          className="h-[100%]"
          style={{
            width: fill,
            backgroundColor: color,
          }}
        ></div>
      </div>
    </div>
  );
}
