import { Popup } from "@layout";
import { useTableStore } from "../../../store/useTableStore";
import { Select } from "@ui";
import { sortByType, sortOptions } from "@utils";
import { useState } from "react";

export default function SortPopup() {
  const { activePopup, columnsById } = useTableStore();
  const [sort, setSort] = useState({
    columnId: null,
    operator: "none",
  });

  const { updateSort, applySort, closePopup } = useTableStore.getState();

  if (activePopup !== "sort") return null;

  return (
    <Popup open>
      <Popup.Container className="w-100! h-65! max-w-50">
        <Popup.Header title="Sort" onClose={closePopup} />

        <Popup.Body className="px-4 py-4 flex flex-col gap-4">
          {/* Column */}
          <Select
            label="Column"
            options={Object.values(columnsById)}
            getLabel={(o) => o.label}
            getKey={(o) => o.id}
            value={sort.columnId}
            onChange={(o) => setSort({ columnId: o.id, operator: "none" })}
          />
          {/* Sort type */}
          <Select
            label="Sort Order"
            options={sortByType[columnsById[sort?.columnId]?.type] ?? ["none"]}
            getLabel={(o) => sortOptions[o]}
            value={sort.operator}
            onChange={(o) =>
              setSort((p) => ({ columnId: p.columnId, operator: o }))
            }
          />
        </Popup.Body>

        <Popup.Footer
          text={["Clear", "Apply"]}
          onCancel={() => setSort({ columnId: null, operator: "none" })}
          onApply={() => {
            updateSort(sort.columnId, sort.operator);
            applySort();
          }}
        />
      </Popup.Container>
    </Popup>
  );
}
