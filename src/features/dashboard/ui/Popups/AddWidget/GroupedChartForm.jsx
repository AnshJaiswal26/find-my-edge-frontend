import {
  forwardRef,
  Fragment,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Button, ExpressionBuilder, Input } from "@ui";
import { Divider, Section } from "@layout";
import { Trash2 } from "lucide-react";
import { useDashboardStore } from "@features/dashboard/store";

export const GroupedChartForm = forwardRef(({ type, schemasById }, ref) => {
  const addChart = useDashboardStore((s) => s.addChart);
  const builderRef = useRef();

  const [layout, setLayout] = useState({ title: "" });

  const [expr, setExpr] = useState("");

  const [seriesConfig, setSeriesConfig] = useState([
    {
      key: "",
      name: "",
      type: "",
      ast: null,
    },
  ]);

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

      <Section title={"Series"}>
        {seriesConfig.map((s, i) => (
          <Fragment key={i}>
            {i !== 0 && <Divider />}
            <div className="flex items-end justify-between">
              <Input
                label={"Label"}
                vertical
                value={s.key}
                placeholder="Enter Label"
                onChange={(v) => {
                  setSeriesConfig((p) => {
                    const next = [...p];
                    next[i] = {
                      ...next[i],
                      key: v,
                      name: v,
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
              semanticMode={"AGGREGATE"}
              onCommit={(expr, ast, dependencies, semanticType) => {
                setExpr(expr);
                setSeriesConfig((s) => {
                  const next = [...s];
                  next[i] = {
                    ...next[i],
                    ast,
                    type: semanticType,
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
              setSeriesConfig((p) => [...p, { key: "", name: "", type: "" }])
            }
          >
            + Add Series
          </Button.Text>
        </div>
      </Section>
    </>
  );
});
