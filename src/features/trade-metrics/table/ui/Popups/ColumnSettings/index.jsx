import { useEffect, useRef, useState } from "react";
import { useTableStore } from "@features/trade-metrics/table/store";
import { PopupSideList } from "@shared/components/ui";
import { ColumnDetails } from "../shared";
import { Popup } from "@shared/components/layout";
import { isValid } from "@features/trade-metrics/table/validation";
import { SCHEMA_ROLE, SCHEMA_SOURCE } from "@lib/analytics/schema";
import { useTradeStore } from "@shared/stores";
import { confirmManager } from "@shared/components/ui/managers";
import { toast } from "@shared/services/toast.service";

export default function ColumnSettingsPopup() {
  const builderRef = useRef();

  const columnsById = useTradeStore((s) => s.schemasById);

  const columnsOrder = useTableStore((s) => s.columnsOrder);
  const updateLoading = useTableStore((s) => s.loading.updateSchema);
  // const deleteLoading = useTableStore((s) => s.loading.deleteSchema);

  const closePopup = useTableStore((s) => s.closePopup);
  const updateColumn = useTableStore((s) => s.updateColumn);
  const deleteColumn = useTableStore((s) => s.deleteColumn);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeColumn = columnsById[columnsOrder[activeIndex]];

  const [draft, setDraft] = useState(activeColumn);
  const [error, setError] = useState("");

  console.log(draft);

  useEffect(() => {
    if (activeColumn) {
      setDraft((prev) => {
        // prevent overwrite if same id
        if (prev?.id === activeColumn.id) return prev;
        return { ...activeColumn };
      });
    }
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
      <Popup.Header title={"Column Settings"} onClose={closePopup} />
      <Popup.Body>
        <PopupSideList
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
      <Popup.ActionsFooter
        fnMap={{
          ...(activeColumn.role !== SCHEMA_ROLE.SYSTEM_REQUIRED &&
            activeColumn.role !== SCHEMA_ROLE.SYSTEM_OPTIONAL && {
              Delete: {
                fn: () => {
                  confirmManager.confirm({
                    title: "Delete Column",
                    danger: true,
                    message:
                      "Are you sure you want to delete this column?" +
                      (draft.source === SCHEMA_SOURCE.COMPUTED
                        ? " \nAny charts or statistics using this column may also be affected or removed."
                        : ""),
                    onConfirm: async () => {
                      await deleteColumn(activeColumn.id);
                    },
                    onError: (e) => toast.error(e.message),
                  });
                  closePopup();
                },
              },
            }),
          Cancel: {
            fn: closePopup,
            align: "right",
            disabled: updateLoading,
          },
          Apply: {
            fn: applyChanges,
            disabled: updateLoading,
            loading: updateLoading,
          },
        }}
      />
    </Popup.Container>
  );
}
