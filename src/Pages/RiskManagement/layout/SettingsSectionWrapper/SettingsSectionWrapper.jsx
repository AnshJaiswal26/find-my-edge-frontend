import styles from "./SettingsSectionWrapper.module.css";

export default function SettingsSectionWrappers({ children , style}) {
  return <div className={styles.settingsSectionWrapper} style={style}>{children}</div>;
}
