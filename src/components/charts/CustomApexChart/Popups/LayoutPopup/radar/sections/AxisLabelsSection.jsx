import { Section } from "@layout";
import { InputField, ToggleButton } from "@ui";
import { useChartStore } from "@stores";

export default function AxisLabelsSection({ chartId, updateChart }) {
  return (
    <Section title="Axis Labels">
      <ToggleButton
        label="X Axis Labels"
        value={(s) => s[chartId].draft.layout.showXAxisLabels}
        onClick={() =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.showXAxisLabels =
              !chart.draft.layout.showXAxisLabels;
          })
        }
        store={useChartStore}
      />

      <ToggleButton
        label="Y Axis Labels"
        value={(s) => s[chartId].draft.layout.showYAxisLabels}
        onClick={() =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.showYAxisLabels =
              !chart.draft.layout.showYAxisLabels;
          })
        }
        store={useChartStore}
      />
      <AxisLabels chartId={chartId} updateChart={updateChart} />
    </Section>
  );
}

function AxisLabels({ chartId, updateChart }) {
  const length = useChartStore((s) => s[chartId].series.filtered.length);

  return Array.from({ length }).map((_, i) => (
    <InputField
      key={i}
      label={`Axis ${i + 1}`}
      value={(s) => s[chartId].series.filtered[i].axis}
      placeholder="Enter Axis Label"
      onChange={(v) =>
        updateChart(chartId, (chart) => {
          chart.series.filtered[i].axis = v;
        })
      }
      store={useChartStore}
    />
  ));
}
