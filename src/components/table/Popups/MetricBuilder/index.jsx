import { useMemo, useState } from "react";
import { MetricNameInput } from "./MetricNameInput";
import { FormulaInput } from "./FormulaInput";
import { FormulaValidation } from "./FormulaValidation";
import { useTableStore } from "../../store";
import { Popup } from "@layout";
import { tokenize, toPostfix, buildAST } from "./expression";

export function MetricBuilder() {
  const activePopup = useTableStore((s) => s.activePopup);
  const columnsById = useTableStore((s) => s.columnsById);
  const addMetric = useTableStore((s) => s.addMetric);
  const closePopup = useTableStore((s) => s.closePopup);

  const numericColumns = useMemo(
    () =>
      Object.values(columnsById).filter(
        (c) => c.type === "number" || c.type === "computed"
      ),
    [columnsById]
  );

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
      return buildAST(toPostfix(tokenize(expr)), labelToId);
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
    });
    closePopup();
  };

  if (activePopup !== "add-metric") return null;

  return (
    <Popup open>
      <Popup.Container className="h-90!">
        <Popup.Header title="Add Metric" onClose={closePopup} />

        <Popup.Body className="px-4">
          <div className="space-y-4">
            <MetricNameInput value={name} onChange={setName} />
            <FormulaInput
              value={expr}
              onChange={setExpr}
              ast={ast}
              numericColumns={numericColumns}
            />
            <FormulaValidation valid={!!ast} />
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
