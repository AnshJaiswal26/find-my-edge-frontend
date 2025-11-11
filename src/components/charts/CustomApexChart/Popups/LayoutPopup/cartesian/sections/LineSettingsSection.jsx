import { ToggleButton, ColorPicker, InputField, Select } from "@ui";
import { Section } from "@layout";
import { useChartStore } from "@stores";
import { parseColor } from "@utils";
import { Fragment } from "react";

export default function LineSettingsSection({ chartId, updateChart }) {
  return (
    <>
      <DataSeries chartId={chartId} updateChart={updateChart} />
      {/* Stroke Settings */}
      <Section title="Stroke">
        <InputField
          label="Stroke Width"
          type="range"
          value={(s) => s[chartId].draft.layout.strokeWidth}
          onChange={(v) =>
            updateChart(chartId, (chart) => {
              chart.draft.layout.strokeWidth = v;
            })
          }
          min={1}
          max={10}
          store={useChartStore}
        />
        <Select
          label={"Stroke Type"}
          options={{
            straight: "Straight",
            smooth: "Smooth",
            stepline: "StepLine",
          }}
          value={(s) => s[chartId].draft.layout.curve}
          onChange={(k) =>
            updateChart(chartId, (chart) => {
              chart.draft.layout.curve = k;
            })
          }
          store={useChartStore}
        />

        <SeriesColors
          title={"Stroke"}
          chartId={chartId}
          updateChart={updateChart}
          type="color"
        />
      </Section>
      {/* Marker Settings */}
      <Section title="Marker">
        <InputField
          label="Marker Size"
          type="range"
          value={(s) => s[chartId].draft.layout.markerSize}
          onChange={(v) =>
            updateChart(chartId, (chart) => {
              chart.draft.layout.markerSize = Number(v);
            })
          }
          min={0}
          max={10}
          store={useChartStore}
        />

        <InputField
          label="Marker Hover Size"
          type="range"
          value={(s) => s[chartId].draft.layout.markerHoverSize}
          onChange={(v) =>
            updateChart(chartId, (chart) => {
              chart.draft.layout.markerHoverSize = Number(v);
            })
          }
          min={1}
          max={15}
          store={useChartStore}
        />

        <SeriesColors
          title={"Marker"}
          updateChart={updateChart}
          chartId={chartId}
        />
      </Section>
      {/* Area Settings */}
      <AreaSettingsSection chartId={chartId} updateChart={updateChart} />
    </>
  );
}

function AreaSettingsSection({ chartId, updateChart }) {
  const isAreaVisible = useChartStore((s) => s[chartId].draft.layout.area);

  return (
    <Section title="Area">
      <ToggleButton
        label="Show Area"
        value={(s) => s[chartId].draft.layout.area}
        onClick={() =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.area = !chart.draft.layout.area;
          })
        }
        store={useChartStore}
      />

      {isAreaVisible && (
        <>
          <InputField
            label="Area Opacity From"
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={(s) => s[chartId].draft.layout.areaOpacityFrom}
            onChange={(v) =>
              updateChart(chartId, (chart) => {
                chart.draft.layout.areaOpacityFrom = parseFloat(v);
              })
            }
            store={useChartStore}
          />

          <InputField
            label="Area Opacity To"
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={(s) => s[chartId].draft.layout.areaOpacityTo}
            onChange={(v) =>
              updateChart(chartId, (chart) => {
                chart.draft.layout.areaOpacityTo = parseFloat(v);
              })
            }
            store={useChartStore}
          />

          <ToggleButton
            label={"Area Horizontal"}
            value={(s) => s[chartId].draft.layout.areaGradientHorizontal}
            onClick={() =>
              updateChart(chartId, (chart) => {
                chart.draft.layout.areaGradientHorizontal =
                  !chart.draft.layout.areaGradientHorizontal;
              })
            }
            store={useChartStore}
          />

          <SeriesColors
            title={"Area"}
            chartId={chartId}
            updateChart={updateChart}
            type="areaColor"
          />
        </>
      )}
    </Section>
  );
}

function SeriesColors({ title, chartId, updateChart, type = "markerColor" }) {
  const length = useChartStore((s) => s[chartId].draft.seriesConfig.length);

  return (
    <div className="flex flex-wrap gap-3">
      {Array.from({ length }).map((_, index) => (
        <ColorPicker
          key={index}
          label={`${title} ${index + 1}`}
          value={(s) => parseColor(s[chartId].draft.seriesConfig[index][type])}
          onChange={(c) => {
            updateChart(chartId, (chart) => {
              chart.draft.seriesConfig[index][type] = c;
            });
          }}
          store={useChartStore}
        />
      ))}
    </div>
  );
}

function DataSeries({ chartId, updateChart }) {
  const length = useChartStore((s) => s[chartId].draft.seriesConfig.length);

  return (
    <Section title={"Data Series Name"}>
      {Array.from({ length }).map((_, index) => (
        <Section title={`Series ${index + 1}`} key={index} subSection>
          <InputField
            label={"Name"}
            placeholder="Enter Name"
            value={(s) => parseColor(s[chartId].draft.seriesConfig[index].name)}
            onChange={(c) => {
              updateChart(chartId, (chart) => {
                chart.draft.seriesConfig[index].name = c;
              });
            }}
            store={useChartStore}
          />
          <InputField
            label={`Tooltip Label`}
            placeholder="Enter Label"
            value={(s) =>
              parseColor(s[chartId].draft.seriesConfig[index].tooltipLabel)
            }
            onChange={(c) => {
              updateChart(chartId, (chart) => {
                chart.draft.seriesConfig[index].tooltipLabel = c;
              });
            }}
            store={useChartStore}
          />
        </Section>
      ))}
    </Section>
  );
}
