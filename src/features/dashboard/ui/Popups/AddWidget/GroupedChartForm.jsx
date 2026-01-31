import { forwardRef, Fragment, useImperativeHandle, useState } from "react";
import { Button, GroupByBuilder, Input, Select } from "@ui";
import { Divider, Section } from "@layout";
import { Trash2 } from "lucide-react";
import { useDashboardStore } from "@features/dashboard/store";

import { RATIO_FUNCTIONS } from "@lib/analytics/engine/functions/ratio";
import { useFilteredOptions } from "@features/dashboard/hooks";
import { draftToSpec } from "@lib/analytics/engine/data";

export const GroupedChartForm = forwardRef(
  ({ type, options, schemasById }, ref) => {
    const addChart = useDashboardStore((s) => s.addChart);

    const [groupBy, setGroupBy] = useState({});
    const [grouping, setGrouping] = useState(false);

    const [layout, setLayout] = useState({ title: "" });

    const [seriesConfig, setSeriesConfig] = useState([
      {
        key: "",
        name: "",
        type: "",
        reducer: "",
      },
    ]);

    const { optionsGroup, baseOptions, filteredOptions } = useFilteredOptions({
      series: seriesConfig,
      setSeries: setSeriesConfig,
      groupSpec: draftToSpec(groupBy),
      options,
    });

    useImperativeHandle(ref, () => ({
      submit() {
        if (!seriesConfig[0]?.key) return;

        addChart(type, {
          layout,
          seriesConfig,
          groupSpec: draftToSpec(groupBy),
        });

        return;
      },
    }));

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

        <Button.Toggle
          label={"Grouping"}
          hint={"Group chart series by metric"}
          value={grouping}
          onChange={setGrouping}
        />

        {grouping && (
          <Section title={"Group Chart Series"}>
            <GroupByBuilder
              schemasById={schemasById}
              groupBy={groupBy}
              onChange={setGroupBy}
            />
          </Section>
        )}

        <Section title={"Y Axis Series"}>
          {seriesConfig.map((s, i) => (
            <Fragment key={i}>
              {i !== 0 && <Divider />}
              <Select
                vertical
                label={`Series ${i + 1}`}
                value={s.key}
                options={i === 0 ? baseOptions : filteredOptions}
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
                  options={Object.keys(RATIO_FUNCTIONS).map((k) =>
                    k.replace("_N", ""),
                  )}
                  onChange={(o) =>
                    setSeriesConfig((s) => {
                      const next = [...s];
                      next[i] = {
                        ...next[i],
                        reducer: `${o}`,
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
              disabled={!optionsGroup}
              className={!optionsGroup ? "opacity-50 pointer-events-none" : ""}
            >
              + Add Series
            </Button.Text>
          </div>
        </Section>
      </>
    );
  },
);
