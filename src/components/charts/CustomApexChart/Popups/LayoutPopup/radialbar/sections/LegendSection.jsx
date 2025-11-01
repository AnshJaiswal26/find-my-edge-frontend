import { Section } from "@layout";
import { ToggleButton } from "@ui";
import { useChartStore } from "@stores";

export default function RadialLegendSection({ chartId, updateChart }) {
  return (
    <Section title="Legend Settings">
      <ToggleButton
        label={"Show Legend"}
        value={(s) => s.charts[chartId].tempLayout.legend}
        onClick={() =>
          updateChart(chartId, (chart) => {
            chart.tempLayout.legend = !chart.tempLayout.legend;
          })
        }
        store={useChartStore}
      />

      <ToggleButton
        label={"Toggle Data Series"}
        value={(s) => s.charts[chartId].tempLayout.legendToggle ?? false}
        onClick={() =>
          updateChart(chartId, (chart) => {
            chart.tempLayout.legendToggle = !chart.tempLayout.legendToggle;
          })
        }
        store={useChartStore}
      />
    </Section>
  );
}
