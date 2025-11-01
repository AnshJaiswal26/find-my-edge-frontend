import { ToggleButton, Button, ColorPicker, InputField, IconButton } from "@ui";
import { Section } from "@layout";
import { useChartStore } from "@stores";
import { Fragment } from "react";
import { parseColor } from "@utils";
import { Trash2 } from "lucide-react";
import styles from "../CartesianLayoutPopup.module.css";

export default function BarSettingsSection({ chartId, updateChart }) {
  return (
    <Section title="Bar Settings">
      {[
        { title: "Horizontal", key: "horizontal" },
        { title: "Stacked", key: "stacked" },
        { title: "Stacked 100%", key: "stacked100" },
      ].map(({ title, key }, i) => (
        <ToggleButton
          key={i}
          label={title}
          value={(s) => s.charts[chartId].tempLayout[key]}
          onClick={() => {
            updateChart(chartId, (chart) => {
              chart.tempLayout[key] = !chart.tempLayout[key];
              if (key === "stacked100")
                chart.tempLayout.stacked = chart.tempLayout[key];
              if (key === "stacked" && chart.tempLayout.stacked100)
                chart.tempLayout.stacked100 = false;
            });
          }}
          store={useChartStore}
        />
      ))}

      <InputField
        label="Bar Radius"
        type="range"
        value={(s) => s.charts[chartId].tempLayout.barRadius}
        onChange={(v) =>
          updateChart(chartId, (chart) => {
            chart.tempLayout.barRadius = v;
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
  const length = useChartStore(
    (s) => s.charts[chartId].tempSeriesConfig.length
  );

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
    (s) => s.charts[chartId].tempSeriesConfig[seriesIndex]?.colors.length || 0
  );

  if (length === 0) return null;

  return (
    <Section title={`Range Colors Series ${seriesIndex + 1}`}>
      {Array.from({ length }).map((_, index) => (
        <Fragment key={index}>
          <div className={styles.colorRangeGrid}>
            {[
              { key: "from", label: "From" },
              { key: "to", label: "To" },
              { key: "label", label: "Tooltip Label" },
            ].map(({ key, label }, idx) => (
              <InputField
                key={idx}
                labelPosition="top"
                size="small"
                label={label}
                type={key === "label" ? "text" : "number"}
                value={(s) =>
                  s.charts[chartId].tempSeriesConfig[seriesIndex].colors[index][
                    key
                  ]
                }
                onChange={(v) =>
                  updateChart(chartId, (chart) => {
                    chart.tempSeriesConfig[seriesIndex].colors[index][key] = v;
                  })
                }
                store={useChartStore}
              />
            ))}

            <ColorPicker
              label="Color"
              value={(s) =>
                parseColor(
                  s.charts[chartId].tempSeriesConfig[seriesIndex].colors[index]
                    .color
                )
              }
              onChange={(c) =>
                updateChart(chartId, (chart) => {
                  chart.tempSeriesConfig[seriesIndex].colors[index].color = c;
                })
              }
              store={useChartStore}
            />
            <IconButton
              icon={<Trash2 size={15} />}
              onClick={() =>
                updateChart(chartId, (chart) => {
                  chart.tempSeriesConfig[seriesIndex].colors.splice(index, 1);
                })
              }
              className="p-2"
              store={useChartStore}
            />
          </div>

          {index + 1 < length && (
            <div className="border-t-1 border-[var(--color-bg-hover)] my-2" />
          )}
        </Fragment>
      ))}
      <div className="flex justify-end flex-1">
        <Button
          text={"Add"}
          size="medium"
          onClick={() =>
            updateChart(chartId, (chart) => {
              chart.tempSeriesConfig[seriesIndex].colors.push({
                from: 0,
                to: 0,
                color: "var(--color-default)",
                label: "",
              });
            })
          }
        />
      </div>
    </Section>
  );
}
