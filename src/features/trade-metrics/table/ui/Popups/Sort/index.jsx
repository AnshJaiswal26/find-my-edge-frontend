import { Popup } from "@layout";
import { useTableStore } from "../../../store/useTableStore";
import { Select } from "@ui";
import { sortOptions } from "@utils";

export default function SortPopup() {
  const { activePopup, columnsById, sort } = useTableStore();

  const { setSort, clearSort, applySort, closePopup } =
    useTableStore.getState();

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
            onChange={(o) => setSort(o.id, "none")}
          />

          {/* Sort type */}
          <Select
            label="Sort Order"
            options={Object.keys(sortOptions)}
            getLabel={(o) => sortOptions[o]}
            value={sort.operator}
            onChange={(o) => setSort(sort.columnId, o)}
          />
        </Popup.Body>

        <Popup.Footer
          text={["Clear", "Apply"]}
          onCancel={clearSort}
          onApply={applySort}
        />
      </Popup.Container>
    </Popup>
  );
}
