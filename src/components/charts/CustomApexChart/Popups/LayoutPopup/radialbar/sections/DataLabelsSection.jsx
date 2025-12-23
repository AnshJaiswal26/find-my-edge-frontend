import { Section } from "@layout";
import { Button, Input } from "@ui";
import { useChartStore } from "@stores";

export default function DataLabelSection({ chartId, updateChart }) {
  return (
    <Section title="Data Labels">
      <Section>
        <Button.Toggle
          label={"Name"}
          value={(s) => s[chartId].draft.layout.name}
          onClick={() =>
            updateChart(chartId, (chart) => {
              chart.draft.layout.name = !chart.draft.layout.name;
            })
          }
          store={useChartStore}
        />
      </Section>

      <Section>
        <Button.Toggle
          label={"Value"}
          value={(s) => s[chartId].draft.layout.value}
          onClick={() =>
            updateChart(chartId, (chart) => {
              chart.draft.layout.value = !chart.draft.layout.value;
            })
          }
          store={useChartStore}
        />
        <Input
          label={"Prefix"}
          value={(s) => s[chartId].draft.layout.valuePrefix}
          placeholder="Enter Prefix"
          onChange={(e) =>
            updateChart(chartId, (chart) => {
              chart.draft.layout.valuePrefix = e.target.value;
            })
          }
          store={useChartStore}
        />
        <Input
          label={"Suffix"}
          value={(s) => s[chartId].draft.layout.valueSuffix}
          placeholder="Enter Suffix"
          onChange={(e) =>
            updateChart(chartId, (chart) => {
              chart.draft.layout.valueSuffix = e.target.value;
            })
          }
          store={useChartStore}
        />
      </Section>

      <Section>
        <Button.Toggle
          label={"Total"}
          value={(s) => s[chartId].draft.layout.total}
          onClick={() =>
            updateChart(chartId, (chart) => {
              chart.draft.layout.total = !chart.draft.layout.total;
            })
          }
          store={useChartStore}
        />
        <Input
          label={"Label"}
          value={(s) => s[chartId].draft.layout.totalLabel}
          placeholder="Enter Label"
          onChange={(e) =>
            updateChart(chartId, (chart) => {
              chart.draft.layout.totalLabel = e.target.value;
            })
          }
          store={useChartStore}
        />
        <Input
          label={"Prefix"}
          value={(s) => s[chartId].draft.layout.totalPrefix}
          placeholder="Enter Prefix"
          onChange={(e) =>
            updateChart(chartId, (chart) => {
              chart.draft.layout.totalPrefix = e.target.value;
            })
          }
          store={useChartStore}
        />
        <Input
          label={"Suffix"}
          value={(s) => s[chartId].draft.layout.totalSuffix}
          placeholder="Enter Suffix"
          onChange={(e) =>
            updateChart(chartId, (chart) => {
              chart.draft.layout.totalSuffix = e.target.value;
            })
          }
          store={useChartStore}
        />
      </Section>
    </Section>
  );
}
