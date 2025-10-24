import InputField from "../../InputField";
import { Button, IconButton, ToggleButton } from "../../Buttons";
import { Section } from "@layout";
import { useChartStore } from "@stores";
import ColorPicker from "../../ColorPicker";
import { Fragment } from "react";
import { parseColor } from "@utils";
import { Plus, Trash2 } from "lucide-react";
import styles from "../ChartLayoutPopup.module.css";

export default function BarSettingsSection({ chartId, updateLayout }) {
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
            const current =
              useChartStore.getState().charts[chartId].tempLayout[key];
            updateLayout(
              chartId,
              {
                [key]: !current,
                ...(key === "stacked100" ? { stacked: !current } : {}),
              },
              "tempLayout"
            );
          }}
          store={useChartStore}
        />
      ))}

      <InputField
        label="Bar Radius"
        type="range"
        value={(s) => s.charts[chartId].tempLayout.barRadius}
        onChange={(v) => updateLayout(chartId, { barRadius: v }, "tempLayout")}
        min={0}
        max={10}
        store={useChartStore}
      />

      <ConditionalColoring chartId={chartId} />
    </Section>
  );
}

function ConditionalColoring({ chartId }) {
  const seriesCfg = useChartStore((s) => s.charts[chartId].tempSeriesConfig);
  const updateSeriesConfig = useChartStore((s) => s.updateSeriesConfig);

  return (
    <>
      {seriesCfg.map(({ colors, key }, i) => (
        <Section title={`Range Colors - ${key}`} key={i}>
          {colors.map(({ color, label, from, to }, idx) => (
            <Fragment key={idx}>
              <div className={styles.colorRangeGrid}>
                <InputField
                  labelPosition="top"
                  size="small"
                  label="From"
                  type="number"
                  value={from}
                  onChange={(v) =>
                    updateSeriesConfig(chartId, {
                      type: "update",
                      key,
                      payload: { from: v },
                      index: idx,
                    })
                  }
                />

                <InputField
                  labelPosition="top"
                  size="small"
                  label="To"
                  type="number"
                  value={to}
                  onChange={(v) =>
                    updateSeriesConfig(chartId, {
                      type: "update",
                      key,
                      payload: { to: v },
                      index: idx,
                    })
                  }
                />

                <InputField
                  labelPosition="top"
                  size="small"
                  label="Tooltip Label"
                  type="text"
                  value={label}
                  onChange={(v) =>
                    updateSeriesConfig(chartId, {
                      type: "update",
                      key,
                      payload: { label: v },
                      index: idx,
                    })
                  }
                />
                <IconButton
                  icon={<Trash2 size={15} />}
                  onClick={() =>
                    updateSeriesConfig(chartId, {
                      type: "delete",
                      key,
                      index: idx,
                    })
                  }
                  className="p-2"
                />
                <ColorPicker
                  label="Color"
                  value={parseColor(color)}
                  onChange={(c) =>
                    updateSeriesConfig(chartId, {
                      type: "update",
                      key,
                      payload: { color: c },
                      index: idx,
                    })
                  }
                  store={useChartStore}
                />
              </div>

              {colors.length !== idx + 1 && (
                <div className="border-t-1 border-[var(--color-bg-hover)] my-2" />
              )}
            </Fragment>
          ))}
          <div className="flex justify-end flex-1">
            <Button
              text={"Add"}
              size="medium"
              onClick={() =>
                updateSeriesConfig(chartId, { type: "create", key })
              }
            />
          </div>
        </Section>
      ))}
    </>
  );
}
