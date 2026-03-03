import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import {
  Button,
  ExpressionBuilder,
  GroupByBuilder,
  Input,
  Select,
} from "@shared/components/ui";
import { Section } from "@shared/components/layout";
import { Trash2 } from "lucide-react";
import { useDashboardStore } from "@features/dashboard/store";
import { useFilteredOptions } from "@features/dashboard/hooks";
import { draftToSpec } from "@lib/analytics/engine/data";

export const CartesianChartForm = forwardRef(
  ({ type, options, schemasById }, ref) => {
    const addChart = useDashboardStore((s) => s.addChart);
    const builderRef = useRef();

    const [groupBy, setGroupBy] = useState({});

    const [mode, setMode] = useState("SERIES");

    const [expr, setExpr] = useState("");

    const [layout, setLayout] = useState({
      xTitleText: "",
      yTitleText: "",
      title: "",
    });

    const [seriesX, setSeriesX] = useState({ key: "", name: "", type: "" });

    const [seriesY, setSeriesY] = useState([
      {
        key: "",
        name: "",
        type: "",
        ast: null,
        formula: null,
        dependencies: [],
      },
    ]);

    const { optionsGroup, baseOptions, filteredOptions } = useFilteredOptions({
      series: seriesY,
      setSeries: setSeriesY,
      options,
    });

    useImperativeHandle(ref, () => ({
      submit() {
        if (mode === "GROUP_AGGREGATE") {
          if (!groupBy?.key || !groupBy?.ast) return;
        }

        if (mode === "SERIES") {
          if (!seriesX.key || !seriesY[0]?.key) return;
        }

        if (mode === "GROUP_SELECT") {
          if (!groupBy?.key) return;
        }

        addChart(type, {
          mode,
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

        <Select
          label="Chart Mode"
          value={mode}
          options={[
            { id: "SERIES", label: "Normal Series" },
            { id: "GROUP_SELECT", label: "Grouped (Select)" },
            { id: "GROUP_AGGREGATE", label: "Grouped (Aggregate)" },
          ]}
          getKey={(o) => o.id}
          getLabel={(o) => o.label}
          onChange={(o) => setMode(o.id)}
        />

        {mode === "GROUP_SELECT" && (
          <Section title={"Group Chart Series"}>
            <GroupByBuilder
              schemasById={schemasById}
              groupBy={groupBy}
              onChange={setGroupBy}
            />

            {mode === "GROUP_AGGREGATE" && (
              <ExpressionBuilder
                ref={builderRef}
                value={expr}
                schemasById={schemasById}
                mode={"AGGREGATE"}
                semanticMode={"AGGREGATE"}
                onCommit={({ idFormula, ast, dependencies, semanticType }) => {
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
                        ast,
                        formula: idFormula,
                        dependencies,
                      },
                    ]);

                    setLayout((p) => ({
                      ...p,
                      xTitleText: schemasById[groupBy.key].label,
                      yTitleText: schemasById[dependencies[0]].label,
                    }));
                  }

                  setGroupBy((p) => ({ ...p }));
                }}
              />
            )}
          </Section>
        )}

        {(mode === "SERIES" || mode === "GROUP_SELECT") && (
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
