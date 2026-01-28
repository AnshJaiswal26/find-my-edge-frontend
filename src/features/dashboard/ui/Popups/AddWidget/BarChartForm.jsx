import { useEffect, useMemo, useState } from "react";
import { Button, Input, Select } from "@ui";
import { Section } from "@layout";
import { Trash2 } from "lucide-react";
import { useDashboardStore } from "@features/dashboard/store";

const SERIES_TYPES = {
  number: "number computed",
  time: "time computed",
  date: "date computed",
};

export default function BarChartForm({ options, isAddClicked }) {
  const addChart = useDashboardStore((s) => s.addChart);

  const [layout, setLayout] = useState({
    xTitleText: "",
    yTitleText: "",
    title: "",
  });

  const [seriesX, setSeriesX] = useState({ key: "", name: "", type: "" });

  const [seriesY, setSeriesY] = useState([
    { key: "", name: "", type: "", colorRules: [] },
  ]);

  const numericOptions = useMemo(
    () => options.filter((o) => o.type !== "text" && o.type !== "select"),
    [options],
  );

  const numericOptionsByType = useMemo(
    () =>
      numericOptions.filter((o) => {
        if (o.type === "time computed") {
          return seriesY[0]?.type === "time computed";
        } else if (o.type === "date computed") {
          return seriesY[0]?.type === "date computed";
        } else if (o.type === "time") {
          return seriesY[0]?.type === "time";
        } else if (o.type === "date") {
          return seriesY[0]?.type === "date";
        } else {
          return (
            seriesY[0]?.type === "number" ||
            seriesY[0]?.type === "number computed"
          );
        }
      }),
    [numericOptions, seriesY[0].type],
  );

  useEffect(() => {
    setSeriesY((p) =>
      p.map((s) => ({
        ...s,
        type: numericOptionsByType[0]?.type || "number",
      })),
    );
  }, [seriesY[0].type]);

  useEffect(() => {
    if (isAddClicked) {
      addChart("bar", {
        layout: {
          ...layout,
          xFormat: "",
        },
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
              options={i === 0 ? numericOptions : numericOptionsByType}
              getLabel={(o) => o.label}
              getKey={(o) => o.id}
              onChange={(o) => {
                setSeriesY((p) => {
                  const next = [...p];
                  next[i] = {
                    key: o.id,
                    name: o.label,
                    type: o.type,
                    colorRules: [],
                  };
                  if (p.length > 1) {
                    p.forEach((series, idx) => {
                      if (idx > 0) {
                        next[idx].type = next[0].type;
                      }
                    });
                  }
                  return next;
                });
                setLayout((p) => ({ ...p, yTitleText: o.label }));
              }}
            />
            <Button.Icon
              onClick={() => setSeriesY((p) => p.filter((_, idx) => idx !== i))}
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
          >
            + Add Series
          </Button.Text>
        </div>
      </Section>
    </>
  );
}
