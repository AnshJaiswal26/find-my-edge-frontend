import { useMemo, useState } from "react";
import { Popup } from "@shared/components/layout";
import { Select } from "@shared/components/ui";
import { SORT_TYPE, SORT_OPTIONS } from "@shared/utils";
import { useTableStore } from "@features/trade-metrics/table/store";
import { useTradeStore } from "@shared/stores";

export default function SortPopup() {
  const schemasById = useTradeStore((s) => s.schemasById);
  const columnsOrder = useTableStore((s) => s.columnsOrder);

  const schemas = useMemo(
    () => columnsOrder.map((id) => schemasById[id]),
    [schemasById, columnsOrder],
  );

  const sort = useTableStore((s) => s.sort);

  const [draft, setDraft] = useState({ ...sort });

  const { applySort, clearSort, closePopup } = useTableStore.getState();

  return (
    <Popup open>
      <Popup.Container className="w-100! h-65! max-w-50">
        <Popup.Header title="Sort" onClose={closePopup} />

        <Popup.Body className="px-4 py-4 flex flex-col gap-4">
          {/* Column */}
          <Select
            label="Column"
            options={schemas}
            getLabel={(o) => o.label}
            getKey={(o) => o.id}
            value={draft.columnId}
            onChange={(o) => setDraft({ columnId: o.id, operator: "none" })}
          />
          {/* Sort type */}
          <Select
            label="Sort Order"
            options={
              SORT_TYPE[schemasById[draft?.columnId]?.semanticType] ?? ["none"]
            }
            getLabel={(o) => SORT_OPTIONS[o]}
            value={draft.operator}
            onChange={(o) =>
              setDraft((p) => ({ columnId: p.columnId, operator: o }))
            }
          />
        </Popup.Body>

        <Popup.Footer
          text={["Clear", "Apply"]}
          onCancel={clearSort}
          onApply={() => applySort(draft)}
        />
      </Popup.Container>
    </Popup>
  );
}
