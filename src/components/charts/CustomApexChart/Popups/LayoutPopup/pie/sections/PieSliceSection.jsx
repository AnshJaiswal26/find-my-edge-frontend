import { Section } from "@layout";
import { ColorPicker, InputField, Select } from "@ui";
import { parseColor } from "@utils";
import { useChartStore } from "@stores";

export default function PieSliceSection({ chartId, updateChart }) {
  return (
    <Section title="Pie Slice">
      <Select
        label={"Gradient Type"}
        value={(s) => s[chartId].draft.layout.gradientType}
        options={{ gradient: "Gradient", solid: "Solid" }}
        onChange={(k) =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.gradientType = k;
          })
        }
        store={useChartStore}
      />

      <InputField
        label={"Slice Stroke Width"}
        type="range"
        value={(s) => s[chartId].draft.layout.strokeWidth}
        onChange={(v) =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.strokeWidth = v;
          })
        }
        min={0}
        max={20}
        store={useChartStore}
      />

      <PieColors chartId={chartId} updateChart={updateChart} />
    </Section>
  );
}

function PieColors({ chartId, updateChart }) {
  const length = useChartStore((s) => s[chartId].draft.seriesConfig.length);

  return Array.from({ length }).map((_, i) => (
    <Section title={`Series ${i + 1}`} key={i} subSection>
      <InputField
        label={"Name"}
        value={(s) => s[chartId].draft.seriesConfig[i].name}
        onChange={(v) =>
          updateChart(chartId, (chart) => {
            chart.draft.seriesConfig[i].name = v;
          })
        }
        store={useChartStore}
      />
      <InputField
        label={"Tooltip Label"}
        value={(s) => s[chartId].draft.seriesConfig[i].tooltipLabel}
        onChange={(v) =>
          updateChart(chartId, (chart) => {
            chart.draft.seriesConfig[i].tooltipLabel = v;
          })
        }
        store={useChartStore}
      />
      <ColorPicker
        label="Slice Color"
        value={(s) => parseColor(s[chartId].draft.seriesConfig[i].color)}
        onChange={(c) =>
          updateChart(chartId, (chart) => {
            chart.draft.seriesConfig[i].color = c;
          })
        }
        store={useChartStore}
      />
    </Section>
  ));
}
