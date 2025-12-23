import { ColorPicker, Input, Select, Button } from "@ui";
import { Section } from "@layout";
import { useChartStore } from "@stores";
import { parseColor } from "@utils";

export default function LineSettingsSection({ chartId, updateChart }) {
  return (
    <>
      <DataSeries chartId={chartId} updateChart={updateChart} />
      {/* Stroke Settings */}
      <Section title="Stroke">
        <Input
          label="Stroke Width"
          type="range"
          value={(s) => s[chartId].draft.layout.strokeWidth}
          onChange={(e) =>
            updateChart(chartId, (chart) => {
              chart.draft.layout.strokeWidth = e.target.value;
            })
          }
          min={1}
          max={10}
          store={useChartStore}
        />
        <Select
          label={"Stroke Type"}
          options={["Straight", "Smooth", "StepLine"]}
          value={(s) => s[chartId].draft.layout.curve}
          getKey={(v) => v.toLowerCase()}
          onChange={(v) =>
            updateChart(chartId, (chart) => {
              chart.draft.layout.curve = v.toLowerCase();
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
        <Input
          label="Marker Size"
          type="range"
          value={(s) => s[chartId].draft.layout.markerSize}
          onChange={(e) =>
            updateChart(chartId, (chart) => {
              chart.draft.layout.markerSize = Number(e.target.value);
            })
          }
          min={0}
          max={10}
          store={useChartStore}
        />

        <Input
          label="Marker Hover Size"
          type="range"
          value={(s) => s[chartId].draft.layout.markerHoverSize}
          onChange={(e) =>
            updateChart(chartId, (chart) => {
              chart.draft.layout.markerHoverSize = Number(e.target.value);
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
      <Button.Toggle
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
          <Input
            label="Area Opacity From"
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={(s) => s[chartId].draft.layout.areaOpacityFrom}
            onChange={(e) =>
              updateChart(chartId, (chart) => {
                chart.draft.layout.areaOpacityFrom = parseFloat(e.target.value);
              })
            }
            store={useChartStore}
          />

          <Input
            label="Area Opacity To"
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={(s) => s[chartId].draft.layout.areaOpacityTo}
            onChange={(e) =>
              updateChart(chartId, (chart) => {
                chart.draft.layout.areaOpacityTo = parseFloat(e.target.value);
              })
            }
            store={useChartStore}
          />

          <Button.Toggle
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
          <Input
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
          <Input
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
