import { Section } from "@layout";
import { ColorPicker, Input, Select } from "@ui";
import { parseColor } from "@utils";
import { useChartStore } from "@stores";

export default function RadialBarSection({ chartId, updateChart }) {
  return (
    <Section title="Radial Bar">
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
      <Select
        label={"Radial Line Cap"}
        options={["Round", "Square"]}
        getKey={(v) => v.toLowerCase()}
        value={(s) => s[chartId].draft.layout.strokeLineCap}
        onChange={(v) =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.strokeLineCap = v.toLowerCase();
          })
        }
        store={useChartStore}
      />

      <RadialBarColors chartId={chartId} updateChart={updateChart} />
    </Section>
  );
}

function RadialBarColors({ chartId, updateChart }) {
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
        label="Bar Color"
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
