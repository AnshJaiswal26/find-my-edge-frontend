import { Section } from "@layout";
import { ToggleButton } from "@ui";
import { useChartStore } from "@stores";

export default function RadialLegendSection({ chartId, updateChart }) {
  return (
    <Section title="Legend Settings">
      <ToggleButton
        label={"Show Legend"}
        value={(s) => s[chartId].draft.layout.legend}
        onClick={() =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.legend = !chart.draft.layout.legend;
          })
        }
        store={useChartStore}
      />

      <ToggleButton
        label={"Toggle Data Series"}
        value={(s) => s[chartId].draft.layout.legendToggle ?? false}
        onClick={() =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.legendToggle = !chart.draft.layout.legendToggle;
          })
        }
        store={useChartStore}
      />
    </Section>
  );
}
