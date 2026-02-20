import { useEffect, useMemo, useRef, useState } from "react";
import { useTableStore } from "@table/store/useTableStore";
import { ConfirmationPopup, SidePanelPopup } from "@ui";
import { ColumnDetails } from "../shared";
import { Popup } from "@layout";
import { isValid } from "@table/validation";
import { SCHEMA_SOURCE } from "@lib/analytics/schema";
import { useTradeStore } from "@stores";

export default function ColumnSettingsPopup() {
  const builderRef = useRef();

  const columnsById = useTradeStore((s) => s.schemasById);

  const columnsOrder = useTableStore((s) => s.columnsOrder);
  const updateLoading = useTableStore((s) => s.loading.updateSchema);
  const deleteLoading = useTableStore((s) => s.loading.deleteSchema);

  const { closePopup, updateColumn, deleteColumn } = useTableStore.getState();

  const [activeIndex, setActiveIndex] = useState(0);
  const activeColumn = columnsById[columnsOrder[activeIndex]];

  const [draft, setDraft] = useState(activeColumn);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  console.log(draft);

  useEffect(() => {
    if (activeColumn) setDraft(activeColumn);
  }, [activeColumn]);

  useEffect(() => {
    if (!columnsOrder.length || !activeColumn) {
      closePopup();
    }
  }, [columnsOrder.length, activeColumn, closePopup]);

  if (!columnsOrder.length || !activeColumn || !draft) {
    return null;
  }

  function applyChanges() {
    const error = builderRef.current?.validateNow?.();

    if (error) {
      setError(error);
      return;
    }

    if (!isValid(draft, setError, { activeColumn, columnsById, columnsOrder }))
      return;
    updateColumn(activeColumn.id, draft);
  }

  return (
    <Popup.Container className="w-150 !max-w-150 h-[520px]">
      {isDeleting && (
        <ConfirmationPopup
          open={true}
          message="Are you sure you want to delete this column"
          onCancel={() => setIsDeleting(false)}
          onConfirm={() => {
            setIsDeleting(false);
            deleteColumn(activeColumn.id);
          }}
        />
      )}
      <Popup.Header title={"Column Settings"} onClose={closePopup} />
      <Popup.Body>
        <SidePanelPopup
          items={columnsOrder}
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
              settings
            />
          )}
        />
      </Popup.Body>
      <Popup.MultiButtonFooter
        fnMap={{
          ...(activeColumn.source !== SCHEMA_SOURCE.SYSTEM && {
            Delete: {
              fn: () => setIsDeleting(true),
              loading: deleteLoading,
              disabled: deleteLoading,
            },
          }),
          Cancel: {
            fn: closePopup,
            align: "right",
            disabled: updateLoading || deleteLoading,
          },
          Apply: {
            fn: applyChanges,
            disabled: updateLoading || deleteLoading,
            loading: updateLoading,
          },
        }}
      />
    </Popup.Container>
  );
}
