import { Container } from "@layout";
import styles from "./CustomApexChart.module.css";

export function ChartContainer({ chartId, children }) {
  return (
    <Container
      id={`${chartId}-container`}
      className={styles.chartContainer}
      childClassName={styles.chartInnerContainer}
    >
      <div className={`chart-toolbar ${styles.chartDragIcon}`}>⠿</div>
      {children}
    </Container>
  );
}
