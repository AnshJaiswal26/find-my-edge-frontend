import { Section } from "@layout";
import { Button, InputField } from "@ui";
import { useChartStore } from "@stores";

export default function DataLabelSection({ chartId, updateChart }) {
  return (
    <>
      <Section title="Center Labels">
        <Section title={"Name"} subSection>
          <Button.Toggle
            label={"Show"}
            value={(s) => s[chartId].draft.layout.name}
            onClick={() =>
              updateChart(chartId, (chart) => {
                chart.draft.layout.name = !chart.draft.layout.name;
              })
            }
            store={useChartStore}
          />
        </Section>

        <Section title={"Value"} subSection>
          <Button.Toggle
            label={"Show"}
            value={(s) => s[chartId].draft.layout.value}
            onClick={() =>
              updateChart(chartId, (chart) => {
                chart.draft.layout.value = !chart.draft.layout.value;
              })
            }
            store={useChartStore}
          />
          <InputField
            label={"Prefix"}
            value={(s) => s[chartId].draft.layout.valuePrefix}
            placeholder="Enter Prefix"
            onChange={(v) =>
              updateChart(chartId, (chart) => {
                chart.draft.layout.valuePrefix = v;
              })
            }
            store={useChartStore}
          />
          <InputField
            label={"Suffix"}
            value={(s) => s[chartId].draft.layout.valueSuffix}
            placeholder="Enter Suffix"
            onChange={(v) =>
              updateChart(chartId, (chart) => {
                chart.draft.layout.valueSuffix = v;
              })
            }
            store={useChartStore}
          />
        </Section>

        <Section title={"Total"} subSection>
          <Button.Toggle
            label={"Show"}
            value={(s) => s[chartId].draft.layout.total}
            onClick={() =>
              updateChart(chartId, (chart) => {
                chart.draft.layout.total = !chart.draft.layout.total;
              })
            }
            store={useChartStore}
          />
          <InputField
            label={"Label"}
            value={(s) => s[chartId].draft.layout.totalLabel}
            placeholder="Enter Label"
            onChange={(v) =>
              updateChart(chartId, (chart) => {
                chart.draft.layout.totalLabel = v;
              })
            }
            store={useChartStore}
          />
          <InputField
            label={"Prefix"}
            value={(s) => s[chartId].draft.layout.totalPrefix}
            placeholder="Enter Prefix"
            onChange={(v) =>
              updateChart(chartId, (chart) => {
                chart.draft.layout.totalPrefix = v;
              })
            }
            store={useChartStore}
          />
          <InputField
            label={"Suffix"}
            value={(s) => s[chartId].draft.layout.totalSuffix}
            placeholder="Enter Suffix"
            onChange={(v) =>
              updateChart(chartId, (chart) => {
                chart.draft.layout.totalSuffix = v;
              })
            }
            store={useChartStore}
          />
        </Section>
      </Section>
    </>
  );
}
