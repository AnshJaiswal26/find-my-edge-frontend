import { useEffect, useState } from "react";
import { useTableStore } from "@table/store/useTableStore";
import { SidePanelPopup } from "@ui";
import { ColumnDetails } from "../shared";
import { Popup } from "@layout";

export default function ColumnSettingsPopup() {
  const columnsById = useTableStore((s) => s.columnsById);
  const columnOrder = useTableStore((s) => s.columnOrder);
  const { closePopup, updateColumn, deleteColumn } = useTableStore.getState();

  const [activeIndex, setActiveIndex] = useState(0);
  const activeColumn = columnsById[columnOrder[activeIndex]];

  const [draft, setDraft] = useState(activeColumn);

  useEffect(() => {
    if (activeColumn) setDraft(activeColumn);
  }, [activeColumn]);

  if (!columnOrder.length || !activeColumn || !draft) {
    closePopup();
    return null;
  }

  const isValid = () => {
    if (!draft.label.trim()) return false;
    if (draft.type.includes("computed") && !draft.expression) return false;

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

  function applyChanges() {
    if (!isValid()) return;
    updateColumn(activeColumn.id, draft);
  }

  return (
    <Popup.Container className="w-150 !max-w-150 h-[520px]">
      <Popup.Header title={"Column Settings"} onClose={closePopup} />
      <Popup.Body>
        <SidePanelPopup
          items={columnOrder}
          activeIndex={activeIndex}
          onSelectIndex={setActiveIndex}
          getLabel={(id) => columnsById[id].label}
          renderDetails={() => (
            <ColumnDetails
              column={activeColumn}
              draft={draft}
              onDraftChange={setDraft}
            />
          )}
        />
      </Popup.Body>
      <Popup.MultiButtonFooter
        fnMap={{
          Delete: { fn: () => deleteColumn(activeColumn.id) },
          Cancel: { fn: closePopup, align: "right" },
          Apply: { fn: applyChanges },
        }}
      />
    </Popup.Container>
  );
}
