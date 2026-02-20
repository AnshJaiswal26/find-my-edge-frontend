import { useDashboardStore } from "@features/dashboard/store/useDashboardStore";

import { ColorRules, ExpressionBuilder, Input, Select } from "@ui";
import { DEFAULT_FORMATS, FORMATS } from "@utils";
import { forwardRef, useImperativeHandle, useState } from "react";

export const AddStatsForm = forwardRef(({ schemasById }, ref) => {
  const addStats = useDashboardStore((s) => s.addStats);

  console.log(schemasById);
  const [stat, setStat] = useState({
    title: "",
    ast: null,
    format: "",
    type: "number",
    colorRules: [],
  });

  const [expr, setExpr] = useState("");

  console.log(stat);

  useImperativeHandle(ref, () => ({
    submit() {
      addStats({ id: crypto.randomUUID(), ...stat });
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

      <ExpressionBuilder
        value={expr}
        schemasById={schemasById}
        onCommit={(expr, ast, _, semanticType) => {
          setStat((p) => ({ ...p, ast, type: semanticType }));
          setExpr(expr);
        }}
        mode={"GLOBAL"}
        semanticMode="AGGREGATE"
      />

      <Select
        label="Format"
        value={stat.format || DEFAULT_FORMATS[stat.type]}
        options={FORMATS[stat.type]}
        onChange={(o) => setStat((s) => ({ ...s, format: o }))}
      />

      <ColorRules rules={stat.colorRules} type={stat.type} onChange={setStat} />
    </div>
  );
});
