import { useDashboardStore } from "@features/dashboard/store";

import {
  ColorRules,
  ExpressionBuilder,
  Input,
  Select,
} from "@shared/components/ui";
import { DEFAULT_FORMATS, FORMATS } from "@shared/utils";
import { forwardRef, useImperativeHandle, useState } from "react";

export const AddStatsForm = forwardRef(({ schemasById }, ref) => {
  const addStat = useDashboardStore((s) => s.addStat);

  console.log(schemasById);
  const [stat, setStat] = useState({
    title: "",
    ast: null,
    format: "",
    formula: "",
    type: "number",
    colorRules: [],
  });

  console.log(stat);

  useImperativeHandle(ref, () => ({
    submit() {
      addStat({ id: crypto.randomUUID(), ...stat });
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
        value={stat.formula}
        schemasById={schemasById}
        onCommit={({ idFormula, ast, dependencies, semanticType }) => {
          setStat((p) => ({
            ...p,
            formula: idFormula,
            ast,
            dependencies,
            type: semanticType,
          }));
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
