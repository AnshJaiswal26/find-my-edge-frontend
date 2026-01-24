import { Container } from "@layout";
import styles from "./CustomApexChart.module.css";

export function ChartContainer({ chartId, children }) {
  return (
    <Container
      id={`${chartId}-container`}
      className={`${styles.chartContainer} pr-2! pt-1!`}
      childClassName={styles.chartInnerContainer}
    >
      <div className={`chart-toolbar ${styles.chartDragIcon}`}>⠿</div>
      {children}
    </Container>
  );
}
