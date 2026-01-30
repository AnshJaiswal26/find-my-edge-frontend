import {
  forwardRef,
  Fragment,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { Button, Input, Select } from "@ui";
import { Divider, Section } from "@layout";
import { Trash2 } from "lucide-react";
import { useDashboardStore } from "@features/dashboard/store";
import { COLUMN_TYPES_GROUP } from "@table/model";
import { WINDOW_FUNCTIONS } from "@lib/analytics/engine/functions/window/registry";

export const GroupedChartForm = forwardRef(({ type, options }, ref) => {
  const addChart = useDashboardStore((s) => s.addChart);

  const [layout, setLayout] = useState({ title: "" });

  const [seriesConfig, setSeriesConfig] = useState([
    {
      key: "",
      name: "",
      type: "",
      reducer: "",
    },
  ]);

  const yAxisGroup = useMemo(() => {
    const first = seriesConfig[0];
    return first?.type ? COLUMN_TYPES_GROUP[first.type] : null;
  }, [seriesConfig]);

  const baseYOptions = useMemo(() => {
    return options.filter((o) => {
      const group = COLUMN_TYPES_GROUP[o.type];
      return group && group !== "text"; // allow all numeric/date/time
    });
  }, [options]);

  const filteredYOptions = useMemo(() => {
    if (!yAxisGroup) return baseYOptions;

    return baseYOptions.filter(
      (o) => COLUMN_TYPES_GROUP[o.type] === yAxisGroup,
    );
  }, [baseYOptions, yAxisGroup]);

  useImperativeHandle(ref, () => ({
    submit() {
      if (!seriesConfig[0]?.key) return;

      addChart(type, {
        layout,
        seriesConfig,
      });

      return;
    },
  }));

  useEffect(() => {
    if (!yAxisGroup) return;

    setSeriesConfig((prev) =>
      prev.map((s, i) => {
        if (i === 0 || !s.type) return s;

        return COLUMN_TYPES_GROUP[s.type] === yAxisGroup
          ? s
          : { key: "", name: "", type: "" };
      }),
    );
  }, [yAxisGroup]);

  return (
    <>
      <Input
        label="Chart Title"
        vertical
        placeholder="Enter chart title"
        classNames={{ input: "max-w-full!" }}
        value={layout.title}
        onCommit={(v) => setLayout((p) => ({ ...p, title: v }))}
      />

      <Section title={"Y Axis Series"}>
        {seriesConfig.map((s, i) => (
          <Fragment key={i}>
            {i !== 0 && <Divider />}
            <Select
              vertical
              label={`Series ${i + 1}`}
              value={s.key}
              options={i === 0 ? baseYOptions : filteredYOptions}
              getLabel={(o) => o.label}
              getKey={(o) => o.id}
              onChange={(o) => {
                setSeriesConfig((p) => {
                  const next = [...p];
                  next[i] = {
                    ...next[i],
                    key: o.id,
                    name: o.label,
                    type: o.type,
                  };
                  return next;
                });
              }}
            />
            <div key={i} className="flex items-end justify-between">
              <Select
                label="Aggregate"
                vertical
                value={s.reducer.replace("_N", "")}
                options={Object.keys(WINDOW_FUNCTIONS).map((k) =>
                  k.replace("_N", ""),
                )}
                onChange={(o) =>
                  setSeriesConfig((s) => {
                    const next = [...s];
                    next[i] = {
                      ...next[i],
                      reducer: `${o}_N`,
                    };
                    return next;
                  })
                }
              />

              <Button.Icon
                onClick={() =>
                  setSeriesConfig((p) => p.filter((_, idx) => idx !== i))
                }
              >
                <Trash2 size={18} />
              </Button.Icon>
            </div>
          </Fragment>
        ))}
        <div>
          <Button.Text
            onClick={() =>
              setSeriesConfig((p) => [
                ...p,
                { key: "", name: "", type: "", reducer: "" },
              ])
            }
            disabled={!yAxisGroup}
            className={!yAxisGroup ? "opacity-50 pointer-events-none" : ""}
          >
            + Add Series
          </Button.Text>
        </div>
      </Section>
    </>
  );
});
