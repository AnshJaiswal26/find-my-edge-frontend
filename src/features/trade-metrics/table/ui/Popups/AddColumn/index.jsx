import { useMemo, useRef, useState } from "react";
import { ColumnDetails } from "../shared";
import { useTableStore } from "@table/store/useTableStore";
import { Popup } from "@layout";
import { createSchema } from "@lib/analytics/schema";
import { isValid } from "@table/validation";
import { computeOverSequence } from "@lib/analytics/engine/execute";
import { buildAST, tokenize, toPostfix } from "@lib/expression";

export default function AddColumnPopup() {
  const { addColumn, closePopup, columnsById, rowsById, rowOrder } =
    useTableStore.getState();

  const builderRef = useRef();

  const [draft, setDraft] = useState(
    createSchema({
      id: "id",
    }),
  );

  // const value = computeOverSequence({
  //   tradesById: rowsById,
  //   sequenceIds: rowOrder,
  //   getValue: (trade, key) => trade.cells[key].value ?? null,
  //   schema: {
  //     expression: buildAST(
  //       toPostfix(tokenize(`COUNT_IF(pnl > 0 AND date == "Nifty 50")`)),
  //       "GLOBAL",
  //     ).ast,
  //   },
  //   useGlobal: true,
  // });

  // console.log(value);

  const [error, setError] = useState(null);

  const columns = useMemo(() => Object.values(columnsById), []);

  const save = () => {
    const error = builderRef.current.validateNow();

    if (error) {
      setError({ ast: error });
      return;
    }

    if (!isValid(draft, setError, { columns })) return;

    console.time("save");
    addColumn({
      ...draft,
      id: crypto.randomUUID(),
      editable: !draft.type.includes("computed"),
    });
    console.log(draft);
    closePopup();
    console.timeEnd("save");
  };

  return (
    <Popup.Container className="h-110!">
      <Popup.Header title="Add Metric" onClose={closePopup} />

      <Popup.Body className="!p-4 space-y-4 items-center">
        <ColumnDetails
          columns={columns}
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
