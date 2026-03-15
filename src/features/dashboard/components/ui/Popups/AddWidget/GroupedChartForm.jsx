import {
  forwardRef,
  Fragment,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Button,
  ExpressionBuilder,
  Input,
  Divider,
} from "@shared/components/ui";
import { Section } from "@shared/components/layout";
import { Trash2 } from "lucide-react";
import { useDashboardStore } from "@features/dashboard/store";

export const GroupedChartForm = forwardRef(
  ({ type, schemasById, setLoading }, ref) => {
    const addChart = useDashboardStore((s) => s.addChart);
    const builderRef = useRef();

    const [layout, setLayout] = useState({ title: "" });

    const [series, setSeries] = useState([
      {
        field: "",
        label: "",
        type: "",
        ast: null,
        formula: null,
        dependencies: [],
      },
    ]);

    useImperativeHandle(ref, () => ({
      async submit() {
        setLoading(true);
        await addChart({
          chartType: type,
          layout,
          series,
        });
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

        <Section title={"Series"}>
          {series.map((s, i) => (
            <Fragment key={i}>
              {i !== 0 && <Divider />}
              <div className="flex items-end justify-between">
                <Input
                  label={"Label"}
                  vertical
                  value={s.label}
                  placeholder="Enter Label"
                  onChange={(v) => {
                    setSeries((p) => {
                      const next = [...p];
                      next[i] = {
                        ...next[i],
                        label: v,
                      };
                      return next;
                    });
                  }}
                />
                <Button.Icon
                  onClick={() =>
                    setSeries((p) => p.filter((_, idx) => idx !== i))
                  }
                >
                  <Trash2 size={18} />
                </Button.Icon>{" "}
              </div>

              <ExpressionBuilder
                key={i}
                ref={builderRef}
                value={""}
                schemasById={schemasById}
                mode={"AGGREGATE"}
                semanticMode={"AGGREGATE"}
                onCommit={({ idFormula, ast, dependencies, semanticType }) => {
                  setSeries((s) => {
                    const next = [...s];
                    next[i] = {
                      ...next[i],
                      ast,
                      formula: idFormula,
                      dependencies,
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
                setSeries((p) => [...p, { field: "", label: "", type: "" }])
              }
            >
              + Add Series
            </Button.Text>
          </div>
        </Section>
      </>
    );
  },
);
