import { Section } from "@layout";
import { Button, Select } from "@ui";
import { useChartStore } from "@stores";

export default function LegendSection({ chartId, updateChart }) {
  return (
    <Section title={"Legend"}>
      <Button.Toggle
        label={"Show"}
        value={(s) => s[chartId].draft.layout.legend}
        onClick={() =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.legend = !chart.draft.layout.legend;
          })
        }
        store={useChartStore}
      />
      <Select
        label={"Position"}
        options={["Top", "Bottom"]}
        getKey={(v) => v.toLowerCase()}
        value={(s) => s[chartId].draft.layout.legendPosition}
        onChange={(v) =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.legendPosition = v.toLowerCase();
          })
        }
        store={useChartStore}
      />
      <Select
        label={"Alignment"}
        options={["Left", "Center", "Right"]}
        getKey={(v) => v.toLowerCase()}
        value={(s) => s[chartId].draft.layout.legendAlignment}
        onChange={(v) =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.legendAlignment = v.toLowerCase();
          })
        }
        store={useChartStore}
      />
    </Section>
  );
}
