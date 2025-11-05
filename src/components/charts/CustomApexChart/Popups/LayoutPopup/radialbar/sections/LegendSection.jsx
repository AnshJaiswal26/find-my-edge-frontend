import { Section } from "@layout";
import { Select, ToggleButton } from "@ui";
import { useChartStore } from "@stores";

export default function RadialLegendSection({ chartId, updateChart }) {
  return (
    <Section title={"Legend"}>
      <ToggleButton
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
        options={{ top: "Top", bottom: "Bottom" }}
        value={(s) => s[chartId].draft.layout.legendPosition}
        onChange={(k) =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.legendPosition = k;
          })
        }
        store={useChartStore}
      />
      <Select
        label={"Alignment"}
        options={{ left: "Left", center: "Center", right: "Right" }}
        value={(s) => s[chartId].draft.layout.legendAlignment}
        onChange={(k) =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.legendAlignment = k;
          })
        }
        store={useChartStore}
      />
    </Section>
  );
}
