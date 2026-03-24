import { useMemo, useState } from "react";
import { Popup } from "@shared/components/layout";

import { FilterBuilder } from "@shared/components/ui";
import { useChartStore } from "@modules/charts/apex/store";

export default function FilterPopup({ chartId }) {
  const appliedFilters = useChartStore((s) => s.charts[chartId].filters);

  const clearFilters = useChartStore((s) => s.clearFilters);
  const closePopup = useChartStore((s) => s.closePopup);
  const applyFilters = useChartStore((s) => s.applyFilters);

  const seriesOrder = useChartStore((s) => s.charts[chartId].seriesOrder);
  const seriesById = useChartStore((s) => s.charts[chartId].seriesById);

  const seriesConfig = useMemo(
    () => seriesOrder.map((id) => seriesById[id]),
    [seriesOrder],
  );

  const [filters, setFilters] = useState([...appliedFilters]);

  return (
    <Popup open>
      <Popup.Container className="w-50 max-w-50">
        <Popup.Header title="Filters" onClose={closePopup} />

        <Popup.Body className="px-4 py-3 flex flex-col gap-4 justify-between">
          <FilterBuilder
            filters={filters}
            fieldOptions={seriesConfig}
            getKey={(s) => s.id}
            getType={(id) => seriesById[id]?.type}
            setFilters={setFilters}
          />
        </Popup.Body>

        <Popup.Footer
          text={["Clear", "Apply"]}
          onCancel={() => clearFilters(chartId)}
          onApply={() => {
            applyFilters(chartId, filters);
          }}
        />
      </Popup.Container>
    </Popup>
  );
}
