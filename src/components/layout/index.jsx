import { Editor, Sidebar } from "@ui";
import styles from "./layout.module.css";

export const PageContainer = ({
  children,
  className = "",
  editor = true,
  sidebar = true,
  pageActive,
}) => {
  return (
    <div>
      {editor && <Editor />}
      {sidebar && <Sidebar pageActive={pageActive} />}
      <div className={`${styles.pageContainer} ${className}`}>
        <div className={styles.mainContent}>{children}</div>
      </div>
    </div>
  );
};

export const Container = ({
  children,
  className = "",
  title,
  childClassName,
}) => {
  return (
    <div className={`${styles.container} ${className}`}>
      <div className={`${styles.innerContainer} ${className}`}>
        {title && <div className={styles.title}>{title}</div>}
        <div className={`${styles.childrenWrapper} ${childClassName}`}>
          {" "}
          {children}
        </div>
      </div>
    </div>
  );
};

export const Label = ({ children, type = "medium" }) => {
  return <div className={`${styles.label} ${styles[type]}`}>{children}</div>;
};

export const Legend = ({ color, label }) => {
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
};

export const Bar = ({ color, label1, label2, fill }) => {
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
};

export const Badge = ({ value, label, formatter, className }) => {
  const v = Number(value);
  const formatedValue = formatter ? formatter(v) : v;
  const formatedStyle =
    v > 0 ? styles.badgeGreen : v === 0 ? styles.badgeYellow : styles.badgeRed;

  return (
    <div className="flex-box gap-1.5 items-center">
      {label && <span>{label}</span>}
      <div>
        <span
          className={`${styles.badge} ${formatedStyle} text-[0.88rem] p-[3px 5px] ${className}`}
        >
          {formatedValue}
        </span>
      </div>
    </div>
  );
};
