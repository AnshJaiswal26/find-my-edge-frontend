import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Button, ExpressionBuilder, GroupByBuilder, Input, Select } from "@ui";
import { Section } from "@layout";
import { Trash2 } from "lucide-react";
import { useDashboardStore } from "@features/dashboard/store";
import { useFilteredOptions } from "@features/dashboard/hooks";
import { draftToSpec } from "@lib/analytics/engine/data";

export const CartesianChartForm = forwardRef(
  ({ type, options, schemasById }, ref) => {
    const addChart = useDashboardStore((s) => s.addChart);
    const builderRef = useRef();

    const [groupBy, setGroupBy] = useState({});
    const [grouping, setGrouping] = useState(false);
    const [aggregation, setAggregation] = useState(false);

    const [expr, setExpr] = useState("");

    const [layout, setLayout] = useState({
      xTitleText: "",
      yTitleText: "",
      title: "",
    });

    const [seriesX, setSeriesX] = useState({ key: "", name: "", type: "" });

    const [seriesY, setSeriesY] = useState([
      { key: "", name: "", type: "", ast: null },
    ]);

    const { optionsGroup, baseOptions, filteredOptions } = useFilteredOptions({
      series: seriesY,
      setSeries: setSeriesY,
      options,
    });

    useImperativeHandle(ref, () => ({
      submit() {
        console.log(groupBy);
        if (aggregation) {
          if (!groupBy?.key) return;
          if (!groupBy?.ast) return;
        } else {
          if (!seriesX.key) return;
          if (!seriesY[0]?.key) return;
        }

        addChart(type, {
          layout,
          groupSpec: draftToSpec(groupBy),
          x: seriesX,
          y: seriesY,
        });
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

            <Button.Toggle
              label={"Aggregation"}
              hint={"Show aggregate per group (single metric)"}
              value={aggregation}
              onChange={setAggregation}
            />

            {aggregation && (
              <ExpressionBuilder
                ref={builderRef}
                value={expr}
                schemasById={schemasById}
                mode={"GLOBAL"}
                semanticMode={"AGGREGATE"}
                onCommit={(expr, ast, dependencies, semanticType) => {
                  setExpr(expr);

                  if (dependencies.length && groupBy?.key) {
                    setSeriesX({
                      key: groupBy.key,
                      name: schemasById[groupBy.key].label,
                      type: schemasById[groupBy.key].semanticType,
                    });

                    setSeriesY([
                      {
                        key: dependencies[0],
                        name: schemasById[dependencies[0]].label,
                        type: semanticType,
                      },
                    ]);

                    setLayout((p) => ({
                      ...p,
                      xTitleText: schemasById[groupBy.key].label,
                      yTitleText: schemasById[dependencies[0]].label,
                    }));
                  }

                  setGroupBy((p) => ({
                    ...p,
                    ast,
                    type: semanticType,
                  }));
                }}
              />
            )}
          </Section>
        )}

        {!aggregation && (
          <>
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
                          type: o.semanticType,
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
                  className={
                    !optionsGroup ? "opacity-50 pointer-events-none" : ""
                  }
                >
                  + Add Series
                </Button.Text>
              </div>
            </Section>
          </>
        )}
      </>
    );
  },
);
