import { Section } from "@layout";
import { ToggleButton, InputField } from "@ui";
import { useChartStore } from "@stores";

export default function RadialDataLabelSection({ chartId, updateChart }) {
  return (
    <Section title="Data Label Settings">
      <ToggleButton
        label={"Show Name"}
        value={(s) => s.charts[chartId].tempLayout.name}
        onClick={() =>
          updateChart(chartId, (chart) => {
            chart.tempLayout.name = !chart.tempLayout.name;
          })
        }
        store={useChartStore}
      />

      <ToggleButton
        label={"Show Value"}
        value={(s) => s.charts[chartId].tempLayout.value}
        onClick={() =>
          updateChart(chartId, (chart) => {
            chart.tempLayout.value = !chart.tempLayout.value;
          })
        }
        store={useChartStore}
      />

      <ToggleButton
        label={"Show Total"}
        value={(s) => s.charts[chartId].tempLayout.total}
        onClick={() =>
          updateChart(chartId, (chart) => {
            chart.tempLayout.total = !chart.tempLayout.total;
          })
        }
        store={useChartStore}
      />

      <InputField
        label="Total Value (static)"
        type="number"
        value={(s) => s.charts[chartId].tempLayout.totalValue ?? 70}
        onChange={(v) =>
          updateChart(chartId, (chart) => {
            chart.tempLayout.totalValue = parseInt(v);
          })
        }
        store={useChartStore}
      />
    </Section>
  );
}
