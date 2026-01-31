import { forwardRef, useImperativeHandle, useState } from "react";
import { Button, GroupByBuilder, Input, Select } from "@ui";
import { Section } from "@layout";
import { Trash2 } from "lucide-react";
import { useDashboardStore } from "@features/dashboard/store";
import { useFilteredOptions } from "@features/dashboard/hooks";
import { draftToSpec } from "@lib/analytics/engine/data";

export const CartesianChartForm = forwardRef(
  ({ type, options, schemasById }, ref) => {
    const addChart = useDashboardStore((s) => s.addChart);

    const [groupBy, setGroupBy] = useState({});
    const [grouping, setGrouping] = useState(false);

    const [layout, setLayout] = useState({
      xTitleText: "",
      yTitleText: "",
      title: "",
    });

    const [seriesX, setSeriesX] = useState({ key: "", name: "", type: "" });

    const [seriesY, setSeriesY] = useState([{ key: "", name: "", type: "" }]);

    const { optionsGroup, baseOptions, filteredOptions } = useFilteredOptions({
      series: seriesY,
      setSeries: setSeriesY,
      options,
    });

    useImperativeHandle(ref, () => ({
      submit() {
        if (!seriesX.key) return;
        if (!seriesY[0]?.key) return;

        addChart(type, {
          layout,
          groupSpec: draftToSpec(groupBy),
          x: seriesX,
          y: seriesY,
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

        <Section title={"X Axis Series"}>
          <Select
            value={seriesX.key}
            options={options}
            getLabel={(o) => o.label}
            getKey={(o) => o.id}
            onChange={(o) => {
              setSeriesX({ key: o.id, name: o.label, type: o.type });
              setLayout((p) => ({ ...p, xTitleText: o.label }));
            }}
          />
        </Section>

        <Section title={"Y Axis Series"}>
          {seriesY.map((s, i) => (
            <div key={i} className="flex items-end justify-between">
              <Select
                vertical
                label={`Series ${i + 1}`}
                value={s.key}
                options={i === 0 ? baseOptions : filteredOptions}
                getLabel={(o) => o.label}
                getKey={(o) => o.id}
                onChange={(o) => {
                  setSeriesY((p) => {
                    const next = [...p];
                    next[i] = {
                      key: o.id,
                      name: o.label,
                      type: o.type,
                    };
                    return next;
                  });
                  setLayout((p) => ({ ...p, yTitleText: o.label }));
                }}
              />
              <Button.Icon
                onClick={() =>
                  setSeriesY((p) => p.filter((_, idx) => idx !== i))
                }
              >
                <Trash2 size={18} />
              </Button.Icon>
            </div>
          ))}
          <div>
            <Button.Text
              onClick={() =>
                setSeriesY((p) => [...p, { key: "", name: "", type: "" }])
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
