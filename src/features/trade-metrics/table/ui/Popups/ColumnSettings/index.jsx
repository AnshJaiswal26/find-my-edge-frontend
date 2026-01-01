import { useEffect, useState } from "react";
import { Popup } from "@layout";
import { useTableStore } from "../../../store/useTableStore";
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

  const [activeColId, setActiveColId] = useState(columnOrder[0] || null);
  const [draft, setDraft] = useState(columnsById[activeColId] || null);

  if (columnOrder.length === 0 || !activeColId || !draft) {
    closePopup();
    return null;
  }

  /* ---------------- validation ---------------- */

  const isValid = () => {
    if (!draft.label.trim()) return false;
    if (draft.type === "computed" && !draft.expression) return false;
    if (draft.type === "select") {
      if (
        !draft.options ||
        draft.options.length === 0 ||
        !draft.options.every((o) => o.trim())
      )
        return false;
    }
    return true;
  };

  const validation = isValid();

  /* ---------------- apply ---------------- */

  function applyChanges() {
    console.log("Applying changes:", draft);
    if (!validation) return;
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
            onSelect={(id) => {
              setDraft(columnsById[id]);
              setActiveColId(id);
            }}
          />

          <div className="p-3 w-full overflow-auto">
            {activeColId && (
              <ColumnDetails
                column={columnsById[activeColId]}
                draft={draft}
                onDraftChange={setDraft}
              />
            )}
          </div>
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
