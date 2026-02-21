import { Popup } from "@shared/components/layout";
import { useTableStore } from "@features/trade-metrics/table/store";
import { FilterBuilder } from "@shared/components/ui";

export default function FilterPopup() {
  const filters = useTableStore((s) => s.filters);
  const columnsById = useTableStore((s) => s.columnsById);

  const {
    addFilter,
    updateFilter,
    removeFilter,
    clearFilters,
    closePopup,
    applyFilters,
  } = useTableStore.getState();

  return (
    <Popup open>
      <Popup.Container className="w-50 max-w-50">
        <Popup.Header title="Filters" onClose={closePopup} />

        <Popup.Body className="px-4 py-3 flex flex-col gap-4 justify-between">
          <FilterBuilder
            filters={filters}
            fieldOptions={Object.values(columnsById)}
            getFieldMeta={(key) => columnsById[key]}
            addFilter={addFilter}
            updateFilter={updateFilter}
            removeFilter={removeFilter}
          />
        </Popup.Body>

        <Popup.Footer
          text={["Clear", "Apply"]}
          onCancel={clearFilters}
          onApply={applyFilters}
        />
      </Popup.Container>
    </Popup>
  );
}
