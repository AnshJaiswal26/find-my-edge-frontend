import styles from "./TabSwitcher.module.css";

export default function TabContainer({
  tabs,
  currentTab,
  onClick,
  tabStyle,
  style,
}) {
  return (
    <>
      <div className={styles.tab} style={tabStyle}>
        {tabs.map(({ key, label }) => (
          <div
            key={key}
            style={style}
            className={`${styles.element} ${
              currentTab === key ? styles.selected : ""
            }`}
            onClick={() => onClick(key)}
          >
            {label}
          </div>
        ))}
      </div>
    </>
  );
}
