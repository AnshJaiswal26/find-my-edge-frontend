import { Button } from "@ui";
import { Section } from "@layout";
import { useChartStore } from "@stores";

import {
  GeneralSection,
  XAxisSection,
  YAxisSection,
  BarSettingsSection,
  LineSettingsSection,
} from "./sections";
import LegendSection from "../common sections/LegendSection";

export default function CartesianLayoutPopup({
  chartId,
  type = "bar",
  updateChart,
}) {
  const state = useChartStore.getState();
  const chart = state[chartId];
  const isHorizontal = chart.live.layout.horizontal;

  return (
    <>
      <GeneralSection chartId={chartId} updateChart={updateChart} />
      <Section title="Grid">
        {[
          { title: "X Grid", key: "xGrid" },
          { title: "Y Grid", key: "yGrid" },
        ].map(({ title, key }, i) => (
          <Button.Toggle
            key={i}
            label={title}
            value={(s) => s[chartId].draft.layout[key]}
            onClick={() =>
              updateChart(chartId, (chart) => {
                chart.draft.layout[key] = !chart.draft.layout[key];
              })
            }
            store={useChartStore}
          />
        ))}
      </Section>

      {type === "line" ? (
        <LineSettingsSection chartId={chartId} updateChart={updateChart} />
      ) : type === "bar" ? (
        <BarSettingsSection chartId={chartId} updateChart={updateChart} />
      ) : null}

      <XAxisSection
        chartId={chartId}
        updateChart={updateChart}
        isHorizontal={isHorizontal}
      />

      <YAxisSection
        chartId={chartId}
        updateChart={updateChart}
        isHorizontal={isHorizontal}
      />

      <LegendSection chartId={chartId} updateChart={updateChart} />
    </>
  );
}
