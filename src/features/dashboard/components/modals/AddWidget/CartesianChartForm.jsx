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
import { CHART_MODE } from "@modules/charts/apex/model/enums";
import { SEMANTIC_TYPE } from "@lib/analytics/schema";

export const CartesianChartForm = forwardRef(
  ({ type, options, schemasById, setLoading }, ref) => {
    const addChart = useDashboardStore((s) => s.addChart);
    const builderRef = useRef();

    const [groupSpec, setGroupSpec] = useState({});

    const [mode, setMode] = useState(CHART_MODE.SERIES);

    const [layout, setLayout] = useState({
      xTitleText: "",
      yTitleText: "",
      title: "",
    });

    const [seriesX, setSeriesX] = useState({ field: "", label: "", type: "" });

    const [seriesY, setSeriesY] = useState([
      {
        field: "",
        label: "",
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
      async submit() {
        if (!seriesX.field) return;
        if (!seriesY.length || !seriesY[0].field) return;

        setLoading(true);

        const payload = {
          chartType: type,
          layout,
          mode,
          xMetric: seriesX,
          series: seriesY,
        };

        if (groupSpec?.field || groupSpec?.kind) {
          payload.groupSpec = draftToSpec(groupSpec);
        }

        await addChart(payload);

        setLoading(false);
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
            { mode: CHART_MODE.SERIES, label: "Normal Series" },
            { mode: CHART_MODE.GROUP_SELECT, label: "Grouped (Select)" },
            { mode: CHART_MODE.GROUP_AGGREGATE, label: "Grouped (Aggregate)" },
          ]}
          getKey={(o) => o.mode}
          getLabel={(o) => o.label}
          onChange={(o) => setMode(o.mode)}
        />

        {(mode === CHART_MODE.GROUP_SELECT ||
          mode === CHART_MODE.GROUP_AGGREGATE) && (
          <Section title={"Group chart Series"}>
            <GroupByBuilder
              schemasById={schemasById}
              groupBy={groupSpec}
              onChange={setGroupSpec}
            />

            {mode === CHART_MODE.GROUP_AGGREGATE && (
              <ExpressionBuilder
                ref={builderRef}
                value={""}
                schemasById={schemasById}
                mode={"AGGREGATE"}
                semanticMode={"AGGREGATE"}
                onCommit={({ idFormula, ast, dependencies, semanticType }) => {
                  if (dependencies.length && groupSpec?.field) {
                    setSeriesX({
                      field: groupSpec.field,
                      label: schemasById[groupSpec.field].label,
                      type:
                        groupSpec.kind === "condition"
                          ? SEMANTIC_TYPE.STRING
                          : schemasById[groupSpec.field].semanticType,
                    });

                    setSeriesY([
                      {
                        field: dependencies[0],
                        label: schemasById[dependencies[0]].label,
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

        {(mode === CHART_MODE.SERIES || mode === CHART_MODE.GROUP_SELECT) && (
          <>
            <Section title={"X Axis Series"}>
              <Select
                value={seriesX.field}
                options={options}
                getLabel={(o) => o.label}
                getKey={(o) => o.id}
                onChange={(o) => {
                  setSeriesX({
                    field: o.id,
                    label: o.label,
                    type: o.semanticType,
                  });
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
                    value={s.field}
                    options={i === 0 ? baseOptions : filteredOptions}
                    getLabel={(o) => o.label}
                    getKey={(o) => o.id}
                    onChange={(o) => {
                      setSeriesY((p) => {
                        const next = [...p];
                        next[i] = {
                          field: o.id,
                          label: o.label,
                          type: o.semanticType,
                          dependencies: [o.id],
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
                    setSeriesY((p) => [
                      ...p,
                      { field: "", label: "", type: "" },
                    ])
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
