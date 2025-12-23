import { Section } from "@layout";
import { ColorPicker, Input, Select } from "@ui";
import { parseColor } from "@utils";
import { useChartStore } from "@stores";

export default function PieSliceSection({ chartId, updateChart }) {
  return (
    <Section title="Pie Slice">
      <Select
        label={"Gradient Type"}
        options={["Gradient", "Solid"]}
        getKey={(v) => v.toLowerCase()}
        value={(s) => s[chartId].draft.layout.gradientType}
        onChange={(v) =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.gradientType = v.toLowerCase();
          })
        }
        store={useChartStore}
      />

      <Input
        label={"Slice Stroke Width"}
        type="range"
        value={(s) => s[chartId].draft.layout.strokeWidth}
        onChange={(e) =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.strokeWidth = e.target.value;
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
      <Input
        label={"Name"}
        value={(s) => s[chartId].draft.seriesConfig[i].name}
        onChange={(e) =>
          updateChart(chartId, (chart) => {
            chart.draft.seriesConfig[i].name = e.target.value;
          })
        }
        store={useChartStore}
      />
      <Input
        label={"Tooltip Label"}
        value={(s) => s[chartId].draft.seriesConfig[i].tooltipLabel}
        onChange={(e) =>
          updateChart(chartId, (chart) => {
            chart.draft.seriesConfig[i].tooltipLabel = e.target.value;
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
