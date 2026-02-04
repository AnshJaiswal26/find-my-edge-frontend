import { useMemo, useRef, useState } from "react";
import { ColumnDetails } from "../shared";
import { useTableStore } from "@table/store/useTableStore";
import { Popup } from "@layout";
import { createSchema } from "@lib/analytics/schema";
import { isValid } from "@table/validation";

export default function AddColumnPopup() {
  const { addColumn, closePopup, columnsById, columnOrder } =
    useTableStore.getState();

  const builderRef = useRef();

  const [draft, setDraft] = useState(
    createSchema({
      id: "id",
    }),
  );

  const [error, setError] = useState(null);

  const save = () => {
    const error = builderRef.current?.validateNow?.();

    if (error) {
      setError({ ast: error });
      return;
    }

    if (!isValid(draft, setError, { columnsById, columnOrder })) return;

    // console.time("save");
    addColumn({
      ...draft,
      id: crypto.randomUUID(),
      editable: !draft.type.includes("computed"),
    });
    // console.log(draft);
    closePopup();
    // console.timeEnd("save");
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
      />
    </Popup.Container>
  );
}
