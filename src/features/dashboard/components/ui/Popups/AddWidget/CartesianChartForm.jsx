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
import { ChartMode } from "@modules/charts/apex/model/enums";

export const CartesianChartForm = forwardRef(
  ({ type, options, schemasById, setLoading }, ref) => {
    const addChart = useDashboardStore((s) => s.addChart);
    const builderRef = useRef();

    const [groupSpec, setGroupSpec] = useState({});

    const [mode, setMode] = useState(ChartMode.SERIES);

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
        if (!seriesX.key) return;
        if (!seriesY.length || !seriesY[0].key) return;

        const seriesById = {};
        const seriesOrder = [];

        seriesY.forEach((s, i) => {
          const id = `series_${i}`;

          seriesById[id] = {
            id,
            field: s.key,
            label: s.name,
            type: s.type,
            ast: s.ast ?? null,
            formula: s.formula ?? null,
            dependencies: s.dependencies ?? [],
          };

          seriesOrder.push(id);
        });

        const payload = {
          chartType: type,
          layout,
          xMetric: {
            field: seriesX.key,
            label: seriesX.name,
            type: seriesX.type,
          },
          seriesById,
          seriesOrder,
        };
        console.log("Payload:", payload);

        if (groupSpec?.field || groupSpec?.type) {
          payload.groupSpec = draftToSpec(groupSpec);
        }

        const add = async () => {
          setLoading(true);
          addChart(payload);
          setLoading(false);
        };

        add();
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
            { id: ChartMode.SERIES, label: "Normal Series" },
            { id: ChartMode.GROUP_SELECT, label: "Grouped (Select)" },
            { id: ChartMode.GROUP_AGGREGATE, label: "Grouped (Aggregate)" },
          ]}
          getKey={(o) => o.id}
          getLabel={(o) => o.label}
          onChange={(o) => setMode(o.id)}
        />

        {(mode === ChartMode.GROUP_SELECT ||
          mode === ChartMode.GROUP_AGGREGATE) && (
          <Section title={"Group Chart Series"}>
            <GroupByBuilder
              schemasById={schemasById}
              groupBy={groupSpec}
              onChange={setGroupSpec}
            />

            {ChartMode.GROUP_AGGREGATE && (
              <ExpressionBuilder
                ref={builderRef}
                value={expr}
                schemasById={schemasById}
                mode={"AGGREGATE"}
                semanticMode={"AGGREGATE"}
                onCommit={({ idFormula, ast, dependencies, semanticType }) => {
                  setExpr(idFormula);

                  if (dependencies.length && groupSpec?.field) {
                    setSeriesX({
                      key: groupSpec.field,
                      name: schemasById[groupSpec.field].label,
                      type: schemasById[groupSpec.field].semanticType,
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
                      xTitleText: schemasById[groupSpec.field].label,
                      yTitleText: schemasById[dependencies[0]].label,
                    }));
                  }
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
