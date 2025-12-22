import GeneralSection from "./sections/GeneralSection";
import PolarSection from "./sections/PolarSection";
import LegendSection from "../common sections/LegendSection";
import { Button } from "@ui";
import { useChartStore } from "@stores";
import { Section } from "@layout";

export default function PolarAreaLayoutPopup({ chartId, updateChart }) {
  return (
    <>
      <GeneralSection chartId={chartId} updateChart={updateChart} />
      <PolarSection chartId={chartId} updateChart={updateChart} />

      <Section title={"Axis Labels"}>
        <Button.Toggle
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
      </Section>
      <LegendSection chartId={chartId} updateChart={updateChart} />
    </>
  );
}
