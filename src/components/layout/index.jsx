import { Button, Editor, IconButton, Sidebar } from "@ui";
import styles from "./layout.module.css";
import { X } from "lucide-react";

export const PageContainer = ({
  children,
  className = "",
  editor = true,
  sidebar = true,
  pageActive,
}) => {
  return (
    <div>
      {sidebar && <Sidebar pageActive={pageActive} />}
      <div className={`${styles.pageContainer} ${className}`}>
        {editor && <Editor />}
        <div className={styles.mainContent}>{children}</div>
      </div>
    </div>
  );
};

export const Container = ({
  id,
  children,
  className = "",
  title,
  header,
  childClassName,
}) => {
  return (
    <div id={id} className={`${styles.container} ${className}`}>
      <div className={`${styles.innerContainer} ${className}`}>
        <div className="flex-box justify-between">
          {title && <div className={styles.title}>{title}</div>}
          {header && <div>{header}</div>}
        </div>
        <div className={`${styles.childrenWrapper} ${childClassName}`}>
          {" "}
          {children}
        </div>
      </div>
    </div>
  );
};

export const Section = ({ title, children, subSection = false }) => (
  <div className={`${styles.section} ${subSection ? styles.subSection : ""}`}>
    {title && <h3 className={styles.sectionTitle}>{title}</h3>}
    <div className={styles.sectionContent}>{children}</div>
  </div>
);

export const Label = ({ children, type = "medium" }) => {
  return <div className={`${styles.label} ${styles[type]}`}>{children}</div>;
};

export const Legend = ({
  color,
  label,
  selected,
  onClick = () => null,
  className,
}) => {
  return (
    <div className={`${styles.legendWrapper} ${className}`}>
      <div
        className={`${styles.legendIndicatorLabelWrapper} ${
          selected ? styles.selected : ""
        }`}
        onClick={onClick}
      >
        {Array.isArray(color) ? (
          color.map((c, i) => (
            <div
              key={i}
              className={styles.legendIndicator}
              style={{ backgroundColor: c }}
            ></div>
          ))
        ) : (
          <div
            className={styles.legendIndicator}
            style={{ backgroundColor: color }}
          ></div>
        )}
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

export const Popup = ({
  title,
  children,
  text,
  large = false,
  isVisible = true,
  onClose = () => {},
  onCancel = () => null,
  onApply = () => null,
}) => {
  if (!isVisible) return null;

  return (
    <div className={styles.popupContainer}>
      <div className={`${styles.popup} ${large ? styles.popupLarge : ""}`}>
        <header>
          <div className="flex-box justify-between items-center">
            <div>{title}</div>
            <IconButton
              icon={<X size={17} />}
              className={styles.popupCloseIcon}
              onClick={onClose}
            />
          </div>
        </header>
        <main>{children}</main>

        <footer className={styles.chartPopupFooter}>
          <Button
            text={text?.[0] || "Cancel"}
            size="large"
            onClick={onCancel}
            color="var(--color-bg-hover)"
            className="text-[var(--color-text-charts)]"
          />
          <Button text={text?.[1] || "Apply"} size="large" onClick={onApply} />
        </footer>
      </div>
    </div>
  );
};

export const ChartPopup = ({
  title,
  children,
  isVisible,
  text,
  onCancel = () => null,
  onApply = () => null,
  onClose = () => null,
  className,
}) => {
  if (!isVisible) return null;

  return (
    <div className={styles.chartPopup}>
      <header>
        <span>{title}</span>
        <button onClick={onClose}>
          <X size={14} />
        </button>
      </header>

      <main className={className}>{children}</main>

      <footer className="flex-box justify-end gap-2">
        <Button
          text={text?.[0] || "Cancel"}
          color={"var(--color-bg-hover)"}
          className={"text-[var(--color-text-headings)]"}
          size="small"
          onClick={onCancel}
        />
        <Button text={text?.[1] || "Apply"} size="small" onClick={onApply} />
      </footer>
    </div>
  );
};
