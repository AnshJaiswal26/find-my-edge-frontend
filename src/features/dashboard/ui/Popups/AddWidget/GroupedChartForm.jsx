import {
  forwardRef,
  Fragment,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button, ExpressionBuilder, GroupByBuilder, Input, Select } from "@ui";
import { Divider, Section } from "@layout";
import { Trash2 } from "lucide-react";
import { useDashboardStore } from "@features/dashboard/store";
import { useFilteredOptions } from "@features/dashboard/hooks";
import { draftToSpec } from "@lib/analytics/engine/data";

export const GroupedChartForm = forwardRef(
  ({ type, options, schemasById }, ref) => {
    const addChart = useDashboardStore((s) => s.addChart);
    const builderRef = useRef();

    const [groupBy, setGroupBy] = useState({});
    const [grouping, setGrouping] = useState(false);

    const [layout, setLayout] = useState({ title: "" });

    const [expr, setExpr] = useState("");

    const [seriesConfig, setSeriesConfig] = useState([
      {
        key: "",
        name: "",
        type: "",
        expression: "",
      },
    ]);

    const { optionsGroup, baseOptions, filteredOptions } = useFilteredOptions({
      series: seriesConfig,
      setSeries: setSeriesConfig,
      options,
    });

    useImperativeHandle(ref, () => ({
      submit() {
        if (!grouping && !seriesConfig[0]?.key) return;

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

        {grouping ? (
          <Section title={"Group Chart Series"}>
            <GroupByBuilder
              schemasById={schemasById}
              groupBy={groupBy}
              onChange={setGroupBy}
            />

            <ExpressionBuilder
              ref={builderRef}
              label="Expression Query Per Group"
              value={expr}
              schemasById={schemasById}
              mode={"GLOBAL"}
              semanticMode={type == "radialBar" ? "RATIO_REQUIRED" : "STANDARD"}
              onCommit={(expr, ast, dependency) => {
                setExpr(expr);
                setGroupBy((p) => ({ ...p, ast }));
              }}
            />
          </Section>
        ) : (
          <Section title={"Y Axis Series"}>
            {seriesConfig.map((s, i) => (
              <Fragment key={i}>
                {i !== 0 && <Divider />}
                <div className="flex items-end justify-between">
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
                  <Button.Icon
                    onClick={() =>
                      setSeriesConfig((p) => p.filter((_, idx) => idx !== i))
                    }
                  >
                    <Trash2 size={18} />
                  </Button.Icon>{" "}
                </div>

                <ExpressionBuilder
                  key={i}
                  ref={builderRef}
                  value={expr}
                  schemasById={schemasById}
                  mode={"GLOBAL"}
                  semanticMode={
                    type == "radialBar" ? "RATIO_REQUIRED" : "STANDARD"
                  }
                  onCommit={(expr, ast, dependency) => {
                    setExpr(expr);
                    setSeriesConfig((s) => {
                      const next = [...s];
                      next[i] = {
                        ...next[i],
                        expression: ast,
                      };
                      return next;
                    });
                  }}
                />
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
                className={
                  !optionsGroup ? "opacity-50 pointer-events-none" : ""
                }
              >
                + Add Series
              </Button.Text>
            </div>
          </Section>
        )}
      </>
    );
  },
);
