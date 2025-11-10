import { Section } from "@layout";
import { InputField, ToggleButton } from "@ui";
import { useChartStore } from "@stores";

export default function EdgeLabelsSection({ chartId, updateChart }) {
  return (
    <Section title="Edge Value Labels">
      <ToggleButton
        label="Show Edge Labels"
        value={(s) => s[chartId].draft.layout.showEdgeLabels}
        onChange={() =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.showEdgeLabels =
              !chart.draft.layout.showEdgeLabels;
          })
        }
        store={useChartStore}
      />

      <InputField
        label="Prefix"
        value={(s) => s[chartId].draft.layout.edgeValuePrefix}
        placeholder="Enter Prefix"
        onChange={(v) =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.edgeValuePrefix = v;
          })
        }
        store={useChartStore}
      />

      <InputField
        label="Suffix"
        value={(s) => s[chartId].draft.layout.edgeValueSuffix}
        placeholder="Enter Suffix"
        onChange={(v) =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.edgeValueSuffix = v;
          })
        }
        store={useChartStore}
      />
    </Section>
  );
}
