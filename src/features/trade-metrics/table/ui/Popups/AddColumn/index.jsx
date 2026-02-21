import { useRef, useState } from "react";
import { ColumnDetails } from "../shared";
import { useTableStore } from "@features/trade-metrics/table/store";
import { Popup } from "@shared/components/layout";
import { createSchema, SCHEMA_SOURCE } from "@lib/analytics/schema";
import { isValid } from "@features/trade-metrics/table/validation";
import { useTradeStore } from "@shared/stores";

export default function AddColumnPopup() {
  const loading = useTableStore((s) => s.loading.createSchema);
  const { addColumn, closePopup } = useTableStore.getState();
  const { schemasById: columnsById, schemasOrder: columnsOrder } =
    useTradeStore.getState();

  const builderRef = useRef();

  const [draft, setDraft] = useState(createSchema({}));

  const [error, setError] = useState(null);

  const save = () => {
    const error = builderRef.current?.validateNow?.();

    if (error) {
      setError({ ast: error });
      return;
    }

    if (!isValid(draft, setError, { columnsById, columnsOrder })) return;

    addColumn({
      ...draft,
      editable: draft.source !== SCHEMA_SOURCE.COMPUTED,
    });
  };

  return (
    <Popup.Container className="h-110!">
      <Popup.Header title="Add Metric" onClose={closePopup} />

      <Popup.Body className="!p-4 space-y-4 items-center">
        <ColumnDetails
          columnsById={columnsById}
          draft={draft}
          onDraftChange={setDraft}
          builderRef={builderRef}
          error={error}
        />
      </Popup.Body>

      <Popup.Footer
        text={["Cancel", "Add Column"]}
        onCancel={closePopup}
        onApply={save}
        disableCancel={loading}
        loading={{ apply: loading }}
      />
    </Popup.Container>
  );
}
