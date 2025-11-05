import { Section } from "@layout";
import { ColorPicker, InputField, Select } from "@ui";
import { parseColor } from "@utils";
import { useChartStore } from "@stores";

export default function RadialBarSection({ chartId, updateChart }) {
  return (
    <Section title="Radial Bar">
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
      <Select
        label={"Radial Line Cap"}
        value={(s) => s[chartId].draft.layout.strokeLineCap}
        options={{ round: "Round", square: "Square" }}
        onChange={(k) =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.strokeLineCap = k;
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
    <div className="flex flex-wrap gap-3 items-end" key={i}>
      <InputField
        key={i}
        label={"Bar Name"}
        labelPosition="top"
        type="text"
        value={(s) => s[chartId].draft.seriesConfig[i].name}
        onChange={(v) =>
          updateChart(chartId, (chart) => {
            chart.draft.seriesConfig[i].name = v;
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
    </div>
  ));
}
