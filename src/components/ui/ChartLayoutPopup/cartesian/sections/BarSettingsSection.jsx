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
            updateChart(chartId, {
              tempSeriesColors: (p) => ({
                [key]: !p[key],
                ...(key === "stacked100" ? { stacked: !p[key] } : {}),
              }),
            });
          }}
          store={useChartStore}
        />
      ))}

      <InputField
        label="Bar Radius"
        type="range"
        value={(s) => s.charts[chartId].tempLayout.barRadius}
        onChange={(v) => updateChart(chartId, { tempLayout: { barRadius: v } })}
        min={0}
        max={10}
        store={useChartStore}
      />

      <ConditionalColoring chartId={chartId} updateChart={updateChart} />
    </Section>
  );
}
function ConditionalColoring({ chartId, updateChart }) {
  const series = useChartStore((s) => s.charts[chartId].tempSeries);

  return (
    <>
      {series.map((seriesKey, i) => (
        <ConditionalColoringSection
          key={i}
          chartId={chartId}
          seriesKey={seriesKey}
          updateChart={updateChart}
        />
      ))}
    </>
  );
}

function ConditionalColoringSection({ chartId, seriesKey, updateChart }) {
  const colorsLength = useChartStore(
    (s) => s.charts[chartId].tempSeriesColors[seriesKey]?.length || 0
  );

  return (
    <Section title={`Range Colors - ${seriesKey}`}>
      {Array.from({ length: colorsLength }).map((_, index) => (
        <Fragment key={index}>
          <div className={styles.colorRangeGrid}>
            {[
              { k: "from", v: "From" },
              { k: "to", v: "To" },
              { k: "label", v: "Tooltip Label" },
            ].map(({ k, v }, i) => (
              <InputField
                key={i}
                labelPosition="top"
                size="small"
                label={v}
                type={k === "label" ? "text" : "number"}
                value={(s) =>
                  s.charts[chartId].tempSeriesColors[seriesKey][index][k]
                }
                onChange={(v) =>
                  updateChart(chartId, {
                    tempSeriesColors: (p) => ({
                      [seriesKey]: p[seriesKey].map((r, i) =>
                        index === i
                          ? { ...r, [k]: k === "label" ? v : Number(v) }
                          : r
                      ),
                    }),
                  })
                }
                store={useChartStore}
              />
            ))}

            <IconButton
              icon={<Trash2 size={15} />}
              onClick={() =>
                updateChart(chartId, {
                  tempSeriesColors: (p) => ({
                    [seriesKey]: p[seriesKey].filter((_, i) => index !== i),
                  }),
                })
              }
              className="p-2"
              store={useChartStore}
            />

            <ColorPicker
              label="Color"
              value={(s) =>
                parseColor(
                  s.charts[chartId].tempSeriesColors[seriesKey][index].color
                )
              }
              onChange={(c) =>
                updateChart(chartId, {
                  tempSeriesColors: (p) => ({
                    [seriesKey]: p[seriesKey].map((r, i) =>
                      index === i ? { ...r, color: c } : r
                    ),
                  }),
                })
              }
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
            updateChart(chartId, {
              tempSeriesColors: (p) => ({
                [seriesKey]: [
                  ...p[seriesKey],
                  {
                    from: 0,
                    to: 0,
                    color: "var(--color-default)",
                    label: "",
                  },
                ],
              }),
            })
          }
        />
      </div>
    </Section>
  );
}
