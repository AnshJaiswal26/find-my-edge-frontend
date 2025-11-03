import { Section } from "@layout";
import { ToggleButton, InputField } from "@ui";
import { useChartStore } from "@stores";

export default function RadialDataLabelSection({ chartId, updateChart }) {
  return (
    <Section title="Data Label Settings">
      <ToggleButton
        label={"Show Name"}
        value={(s) => s[chartId].draft.layout.name}
        onClick={() =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.name = !chart.draft.layout.name;
          })
        }
        store={useChartStore}
      />

      <ToggleButton
        label={"Show Value"}
        value={(s) => s[chartId].draft.layout.value}
        onClick={() =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.value = !chart.draft.layout.value;
          })
        }
        store={useChartStore}
      />

      <ToggleButton
        label={"Show Total"}
        value={(s) => s[chartId].draft.layout.total}
        onClick={() =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.total = !chart.draft.layout.total;
          })
        }
        store={useChartStore}
      />

      <InputField
        label="Total Value (static)"
        type="number"
        value={(s) => s[chartId].draft.layout.totalValue ?? 70}
        onChange={(v) =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.totalValue = parseInt(v);
          })
        }
        store={useChartStore}
      />
    </Section>
  );
}
