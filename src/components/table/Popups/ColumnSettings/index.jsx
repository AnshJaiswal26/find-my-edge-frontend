import { useEffect, useState } from "react";
import { Popup } from "@layout";
import { useTableStore } from "../../store";
import { ColumnList } from "./ColumnList";
import { ColumnDetails } from "../shared";

export default function ColumnSettingsPopup() {
  const isOpen = useTableStore((s) => s.activePopup === "column-settings");
  if (!isOpen) return null;

  return <ColumnSettingsPopupContent />;
}

function ColumnSettingsPopupContent() {
  const columnsById = useTableStore((s) => s.columnsById);
  const columnOrder = useTableStore((s) => s.columnOrder);

  const closePopup = useTableStore((s) => s.closePopup);
  const updateColumn = useTableStore((s) => s.updateColumn);

  const [activeColId, setActiveColId] = useState(null);
  const [draft, setDraft] = useState(null);

  /* ---------------- select default column ---------------- */

  useEffect(() => {
    if (!columnOrder.length) return;
    setActiveColId((prev) => prev ?? columnOrder[0]);
  }, [columnOrder]);

  /* ---------------- sync draft on column change ---------------- */

  useEffect(() => {
    if (!activeColId) return;

    const col = columnsById[activeColId];
    if (!col) return;

    setDraft({
      id: col.id,
      label: col.label,
      type: col.type,
      editable: col?.editable,
      dependsOn: col?.dependsOn,
      display: col?.display,
      expression: col?.expression,
      formula: col?.formula,
      colorRules: col?.colorRules,
    });
  }, [activeColId, columnsById]);

  if (!activeColId || !draft) return null;

  console.log(draft);

  /* ---------------- validation ---------------- */

  const isValid =
    draft.label.trim() &&
    (draft.type !== "computed" || draft.ast) &&
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

          {activeColId && (
            <ColumnDetails
              column={columnsById[activeColId]}
              draft={draft}
              onDraftChange={setDraft}
            />
          )}
        </Popup.Body>

        <Popup.Footer
          text={["Cancel", "Apply"]}
          onCancel={closePopup}
          onApply={applyChanges}
        />
      </Popup.Container>
    </Popup>
  );
}

/* ---------------- helpers ---------------- */
