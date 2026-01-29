import { useDashboardStore } from "@features/dashboard/store";
import { Popup } from "@layout";
import { WINDOW_FUNCTIONS } from "@lib/analytics/engine/functions/window/registry";
import { ColorRules, Input, Select } from "@ui";
import { DEFAULT_FORMATS, FORMATS } from "@utils";
import { forwardRef, useImperativeHandle, useState } from "react";

export const AddStatsForm = forwardRef(({ options, schemasById }, ref) => {
  const addStats = useDashboardStore((s) => s.addStats);

  const [stat, setStat] = useState({
    key: options[0].id ?? "date",
    title: "",
    aggregate: "",
    format: options[0].display?.format ?? "NUMBER",
    type: options[0].type ?? "number",
    colorRules: [],
  });

  console.log(stat);

  useImperativeHandle(ref, () => ({
    submit() {
      addStats(stat);
    },
  }));

  return (
    <div className="flex flex-col gap-3">
      <Input
        vertical
        label={"Title"}
        value={stat.title}
        placeholder="Enter card title"
        onCommit={(v) => setStat((s) => ({ ...s, title: v }))}
        classNames={{ input: "max-w-full!" }}
      />
      <Select
        label="Metric"
        options={options}
        value={stat.key}
        getLabel={(s) => s.label}
        getKey={(s) => s.id}
        onChange={(o) =>
          setStat((s) => ({
            ...s,
            key: o.id,
            type: o.type,
            format: o.display?.format ?? "NUMBER",
          }))
        }
      />

      <Select
        label="Aggregate"
        value={stat.aggregate.replace("_N", "")}
        options={Object.keys(WINDOW_FUNCTIONS).map((k) => k.replace("_N", ""))}
        onChange={(o) =>
          setStat((s) => ({
            ...s,
            aggregate: `${o}_N`,
          }))
        }
      />

      <Select
        label="Format"
        value={stat.format || DEFAULT_FORMATS[schemasById[stat.key].type]}
        options={FORMATS[schemasById[stat.key].type]}
        onChange={(o) => setStat((s) => ({ ...s, format: o }))}
      />

      <ColorRules rules={stat.colorRules} type={stat.type} onChange={setStat} />
    </div>
  );
});
