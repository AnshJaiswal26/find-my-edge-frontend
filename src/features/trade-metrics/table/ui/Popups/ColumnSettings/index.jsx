import { useEffect, useMemo, useRef, useState } from "react";
import { useTableStore } from "@table/store/useTableStore";
import { SidePanelPopup } from "@ui";
import { ColumnDetails } from "../shared";
import { Popup } from "@layout";
import { isValid } from "@table/validation";

export default function ColumnSettingsPopup() {
  const builderRef = useRef();

  const columnsById = useTableStore((s) => s.columnsById);
  const columnOrder = useTableStore((s) => s.columnOrder);
  const { closePopup, updateColumn, deleteColumn } = useTableStore.getState();

  const [activeIndex, setActiveIndex] = useState(0);
  const activeColumn = columnsById[columnOrder[activeIndex]];

  const [draft, setDraft] = useState(activeColumn);
  const [error, setError] = useState("");

  useEffect(() => {
    if (activeColumn) setDraft(activeColumn);
  }, [activeColumn]);

  if (!columnOrder.length || !activeColumn || !draft) {
    closePopup();
    return null;
  }

  function applyChanges() {
    const error = builderRef.current?.validateNow?.();

    if (error) {
      setError(error);
      return;
    }

    if (!isValid(draft, setError, { activeColumn, columnsById, columnOrder }))
      return;
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
          renderDetails={(_, i) => (
            <ColumnDetails
              key={i}
              columnsById={columnsById}
              draft={draft}
              onDraftChange={setDraft}
              error={error}
              builderRef={builderRef}
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
