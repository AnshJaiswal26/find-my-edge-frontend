import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { Button, Input, Select } from "@ui";
import { Section } from "@layout";
import { Trash2 } from "lucide-react";
import { useDashboardStore } from "@features/dashboard/store";
import { DEFAULT_FORMATS } from "@utils";
import { COLUMN_TYPES_GROUP } from "@table/model";

export const CartesianChartForm = forwardRef(
  ({ type, options, isAddClicked }, ref) => {
    const addChart = useDashboardStore((s) => s.addChart);

    const [layout, setLayout] = useState({
      xTitleText: "",
      yTitleText: "",
      title: "",
    });

    const [seriesX, setSeriesX] = useState({ key: "", name: "", type: "" });

    const [seriesY, setSeriesY] = useState([{ key: "", name: "", type: "" }]);

    const yAxisGroup = useMemo(() => {
      const first = seriesY[0];
      return first?.type ? COLUMN_TYPES_GROUP[first.type] : null;
    }, [seriesY]);

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
        if (!seriesX.key) return;
        if (!seriesY[0]?.key) return;

        addChart(type, {
          layout: {
            ...layout,
            xFormat: DEFAULT_FORMATS[seriesX.type || "number"],
            yFormat: DEFAULT_FORMATS[seriesY[0].type || "number"],
          },
          x: seriesX,
          y: seriesY,
        });

        return;
      },
    }));

    useEffect(() => {
      if (!yAxisGroup) return;

      setSeriesY((prev) =>
        prev.map((s, i) => {
          if (i === 0 || !s.type) return s;

          return COLUMN_TYPES_GROUP[s.type] === yAxisGroup
            ? s
            : { key: "", name: "", type: "" };
        }),
      );
    }, [yAxisGroup]);

    useEffect(() => {
      if (isAddClicked && seriesX.key) {
        addChart("bar", {
          layout,
          x: seriesX,
          y: seriesY,
        });
      }
    }, [isAddClicked]);

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
                options={i === 0 ? baseYOptions : filteredYOptions}
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
              disabled={!yAxisGroup}
              className={!yAxisGroup ? "opacity-50 pointer-events-none" : ""}
            >
              + Add Series
            </Button.Text>
          </div>
        </Section>
      </>
    );
  },
);
