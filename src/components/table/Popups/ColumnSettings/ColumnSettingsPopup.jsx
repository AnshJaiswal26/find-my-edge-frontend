import { useEffect, useState } from "react";
import { Popup } from "@layout";
import { useTableStore } from "../../store";
import { ColumnList } from "./ColumnList";
import { ColumnDetails } from "./ColumnDetails";
import { tokenize, toPostfix, buildAST } from "../MetricBuilder/expression";
import { useNumericColumns } from "../../hooks";

export function ColumnSettingsPopup() {
  const isOpen = useTableStore((s) => s.activePopup === "column-settings");
  const columnsById = useTableStore((s) => s.columnsById);
  const columnOrder = useTableStore((s) => s.columnOrder);
  const { numericColumns, labelToId } = useNumericColumns();

  const closePopup = useTableStore((s) => s.closePopup);
  const updateColumn = useTableStore((s) => s.updateColumn);

  const [activeColId, setActiveColId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [ast, setAst] = useState(null);

  /* ---------------- select default column ---------------- */

  useEffect(() => {
    if (!isOpen || !columnOrder.length) return;
    setActiveColId((prev) => prev ?? columnOrder[0]);
  }, [isOpen, columnOrder]);

  /* ---------------- sync draft on column change ---------------- */

  useEffect(() => {
    if (!activeColId) return;

    const col = columnsById[activeColId];
    if (!col) return;

    setDraft({
      ast: col.type === "computed" ? safeAST(col.formula, labelToId) : null,
      type: col.type,
      label: col.label,
      formula: col.type === "computed" ? col.formula || "" : "",
      options: col.type === "select" ? [...(col.options || [])] : [],
    });
  }, [activeColId, columnsById]);

  useEffect(() => {
    if (draft) {
      // console.log(
      //   draft.type === "computed",
      //   draft.formula,
      //   labelToId,
      //   safeAST(draft.formula, labelToId)
      // );
      setAst(
        draft.type === "computed" ? safeAST(draft.formula, labelToId) : null
      );
    }
  }, [draft]);

  if (!isOpen || !activeColId || !draft) return null;

  /* ---------------- validation ---------------- */

  const isValid =
    draft.label.trim() &&
    (draft.type !== "computed" || ast) &&
    (draft.type !== "select" ||
      (draft.options.length > 0 && draft.options.every((o) => o.trim())));

  /* ---------------- apply ---------------- */

  function applyChanges() {
    if (!isValid) return;
    updateColumn(activeColId, draft);
    closePopup();
  }

  return (
    <Popup open>
      <Popup.Container className="w-150 !max-w-150 h-[520px]">
        <Popup.Header title="Column Settings" onClose={closePopup} />

        <Popup.Body className="!flex h-full">
          <ColumnList
            columnsById={columnsById}
            columnOrder={columnOrder}
            activeColId={activeColId}
            onSelect={setActiveColId}
          />

          <ColumnDetails
            column={columnsById[activeColId]}
            draft={draft}
            ast={ast}
            numericColumns={numericColumns}
            onDraftChange={setDraft}
          />
        </Popup.Body>

        <Popup.Footer
          text={["Cancel", "Apply"]}
          onCancel={closePopup}
          onApply={applyChanges}
          applyDisabled={!isValid}
        />
      </Popup.Container>
    </Popup>
  );
}

/* ---------------- helpers ---------------- */

function safeAST(expr, labelToId) {
  try {
    return buildAST(toPostfix(tokenize(expr)), labelToId);
  } catch (e) {
    return null;
  }
}
