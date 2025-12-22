import { Button, ColorPicker, InputField, Input } from "@ui";
import { Section } from "@layout";
import { useChartStore } from "@stores";
import { parseColor } from "@utils";
import { Trash2 } from "lucide-react";

export default function BarSettingsSection({ chartId, updateChart }) {
  return (
    <Section title="Bar Settings">
      {[
        { title: "Horizontal", key: "horizontal" },
        { title: "Stacked", key: "stacked" },
        { title: "Stacked 100%", key: "stacked100" },
      ].map(({ title, key }, i) => (
        <Button.Toggle
          key={i}
          label={title}
          value={(s) => s[chartId].draft.layout[key]}
          onClick={() => {
            updateChart(chartId, (chart) => {
              chart.draft.layout[key] = !chart.draft.layout[key];
              if (key === "stacked100")
                chart.draft.layout.stacked = chart.draft.layout[key];
              if (key === "stacked" && chart.draft.layout.stacked100)
                chart.draft.layout.stacked100 = false;
            });
          }}
          store={useChartStore}
        />
      ))}

      <Input
        className={"flex-row text-sm"}
        value={(s) => s[chartId].draft.layout.barRadius}
        store={useChartStore}
      >
        {({ value }) => (
          <>
            <Input.Label>Bar Radius</Input.Label>
            <Input.Range
              className="p-0! w-40!"
              value={value}
              min={0}
              max={10}
              onChange={(e) =>
                updateChart(chartId, (chart) => {
                  chart.draft.layout.barRadius = e.target.value;
                })
              }
            />
          </>
        )}
      </Input>

      <InputField
        label="Bar Radius"
        type="range"
        value={(s) => s[chartId].draft.layout.barRadius}
        onChange={(v) =>
          updateChart(chartId, (chart) => {
            chart.draft.layout.barRadius = v;
          })
        }
        min={0}
        max={10}
        store={useChartStore}
      />

      <ConditionalColorRange chartId={chartId} updateChart={updateChart} />
    </Section>
  );
}
function ConditionalColorRange({ chartId, updateChart }) {
  const length = useChartStore((s) => s[chartId].draft.seriesConfig.length);

  return (
    <>
      {Array.from({ length }).map((_, index) => (
        <ConditionalBarColor
          key={index}
          seriesIndex={index}
          chartId={chartId}
          updateChart={updateChart}
        />
      ))}
    </>
  );
}

function ConditionalBarColor({ seriesIndex, chartId, updateChart }) {
  const length = useChartStore(
    (s) => s[chartId].draft.seriesConfig[seriesIndex]?.colors.length || 0
  );

  if (length === 0) return null;

  return (
    <Section title={`Series ${seriesIndex + 1}`}>
      <InputField
        label={"Series Name"}
        value={(s) => s[chartId].draft.seriesConfig[seriesIndex].name}
        onChange={(v) =>
          updateChart(chartId, (chart) => {
            chart.draft.seriesConfig[seriesIndex].name = v;
          })
        }
        store={useChartStore}
      />{" "}
      {Array.from({ length }).map((_, index) => (
        <Section key={index} subSection title={`Range ${index + 1}`}>
          {[
            { key: "from", label: "From", placeHoldder: "Enter From" },
            { key: "to", label: "To", placeHoldder: "Enter To" },
            {
              key: "tooltipLabel",
              label: "Tooltip Label",
              placeHoldder: "Enter Label",
            },
          ].map(({ key, label, placeHoldder }, idx) => (
            <InputField
              key={idx}
              label={label}
              type={key === "tooltipLabel" ? "text" : "number"}
              placeholder={placeHoldder}
              value={(s) =>
                s[chartId].draft.seriesConfig[seriesIndex].colors[index][key]
              }
              onChange={(v) =>
                updateChart(chartId, (chart) => {
                  chart.draft.seriesConfig[seriesIndex].colors[index][key] = v;
                })
              }
              store={useChartStore}
            />
          ))}

          <div className="flex justify-between">
            <ColorPicker
              label="Color"
              value={(s) =>
                parseColor(
                  s[chartId].draft.seriesConfig[seriesIndex].colors[index].color
                )
              }
              onChange={(c) =>
                updateChart(chartId, (chart) => {
                  chart.draft.seriesConfig[seriesIndex].colors[index].color = c;
                })
              }
              store={useChartStore}
            />

            <Button.Icon
              onClick={() =>
                updateChart(chartId, (chart) => {
                  chart.draft.seriesConfig[seriesIndex].colors.splice(index, 1);
                })
              }
            >
              <Trash2 size={16} className="text-inherit" />
            </Button.Icon>
          </div>
        </Section>
      ))}
      <div className="flex justify-end flex-1">
        <Button
          text={"Add"}
          size="medium"
          onClick={() =>
            updateChart(chartId, (chart) => {
              chart.draft.seriesConfig[seriesIndex].colors.push({
                from: 0,
                to: 0,
                color: "var(--info)",
                tooltipLabel: "",
              });
            })
          }
        />
      </div>
    </Section>
  );
}
