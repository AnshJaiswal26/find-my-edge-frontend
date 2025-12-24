import { useMemo, useState } from "react";
import { MetricNameInput } from "./MetricNameInput";
import { FormulaInput } from "./FormulaInput";
import { useTableStore } from "../../store";
import { Popup } from "@layout";
import { tokenize, toPostfix, buildAST } from "./expression";

export function MetricBuilder() {
  const isOpen = useTableStore((s) => s.activePopup === "add-metric");

  if (!isOpen) return null;

  return <MetricBuilderContent />;
}

function MetricBuilderContent() {
  const numericColumns = useTableStore((s) =>
    Object.values(s.columnsById).filter(
      (c) => c.type === "number" || c.type === "computed"
    )
  );

  const { addMetric, closePopup } = useTableStore.getState();

  const labelToId = useMemo(() => {
    const map = {};
    numericColumns.forEach((c) => {
      map[c.label.toLowerCase()] = c.id;
    });
    return map;
  }, [numericColumns]);

  const [name, setName] = useState("");
  const [expr, setExpr] = useState("");

  const ast = useMemo(() => {
    try {
      return buildAST(toPostfix(tokenize(expr)), numericColumns);
    } catch {
      return null;
    }
  }, [expr, labelToId]);

  const save = () => {
    if (!name || !ast) return;
    addMetric({
      id: crypto.randomUUID(),
      label: name,
      type: "computed",
      expression: ast,
      formula: expr,
    });
    closePopup();
  };

  return (
    <Popup open>
      <Popup.Container className="h-90!">
        <Popup.Header title="Add Metric" onClose={closePopup} />

        <Popup.Body className="px-4 flex items-center">
          <div className="space-y-4">
            <MetricNameInput value={name} onChange={setName} />
            <FormulaInput
              value={expr}
              onChange={setExpr}
              ast={ast}
              numericColumns={numericColumns}
            />
          </div>
        </Popup.Body>

        <Popup.Footer
          text={["Cancel", "Add Metric"]}
          onCancel={closePopup}
          onApply={save}
        />
      </Popup.Container>
    </Popup>
  );
}
