// components/MetricBuilder.jsx
import { useState } from "react";
import { useTableStore } from "./store";
import { Popup } from "@layout";

const OPERATORS = ["+", "-", "*", "/"];

export function MetricBuilder() {
  const columnsById = useTableStore((s) => s.columnsById);
  const acitvePopup = useTableStore((s) => s.activePopup);
  const closePopup = useTableStore((s) => s.closePopup);
  const addMetric = useTableStore((s) => s.addMetric);

  const numericColumns = Object.values(columnsById).filter(
    (c) => c.type === "number" || c.type === "computed"
  );

  const [name, setName] = useState("");
  const [type, setType] = useState("computed");

  const [left, setLeft] = useState("");
  const [op, setOp] = useState("+");
  const [right, setRight] = useState("");

  if (acitvePopup !== "add-metric") return null;

  function buildExpression() {
    return {
      type: "binary",
      op,
      left: { type: "column", columnId: left },
      right: { type: "column", columnId: right },
    };
  }

  function handleSave() {
    if (!name || !left || !right) return;

    addMetric({
      id: crypto.randomUUID(),
      label: name,
      type,
      expression: buildExpression(),
    });

    closePopup();
  }

  return (
    <Popup
      title="Add Metric"
      text={["Cancel", "Add Metric"]}
      isVisible={true}
      onClose={closePopup}
      onCancel={closePopup}
      onApply={handleSave}
    >
      <div className="space-y-4">
        {/* Metric Name */}
        <div>
          <label className="block text-sm mb-1">Metric name</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Position Strength"
          />
        </div>

        {/* Metric Type */}
        <div>
          <label className="block text-sm mb-1">Metric type</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="computed">Computed (per trade)</option>
            <option value="aggregate">Derived / Aggregate</option>
          </select>
        </div>

        {/* Formula Builder */}
        {type === "computed" && (
          <div>
            <label className="block text-sm mb-1">Formula</label>

            <div className="flex gap-2">
              <select
                className="flex-1 border rounded px-2 py-1"
                value={left}
                onChange={(e) => setLeft(e.target.value)}
              >
                <option value="">Select metric</option>
                {numericColumns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>

              <select
                className="w-16 border rounded px-2 py-1 text-center"
                value={op}
                onChange={(e) => setOp(e.target.value)}
              >
                {OPERATORS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>

              <select
                className="flex-1 border rounded px-2 py-1"
                value={right}
                onChange={(e) => setRight(e.target.value)}
              >
                <option value="">Select metric</option>
                {numericColumns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </Popup>
  );
}
