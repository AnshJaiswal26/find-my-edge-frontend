import { useMemo, useState } from "react";
import { Popup } from "@shared/components/layout";
import { Select } from "@shared/components/ui";
import { SORT_OPTIONS, SORT_TYPE } from "@shared/utils";
import { useChartStore } from "@modules/charts/apex/store";

export default function SortPopup({ chartId, schemasById }) {
  const sort = useChartStore((s) => s.charts[chartId].sort);

  const seriesOrder = useChartStore((s) => s.charts[chartId].seriesOrder);
  const seriesById = useChartStore((s) => s.charts[chartId].seriesById);

  const seriesConfig = useMemo(
    () => seriesOrder.map((id) => seriesById[id]),
    [seriesOrder],
  );

  const [draft, setDraft] = useState(sort);

  const { applySort, clearSort, closePopup } = useChartStore.getState();

  return (
    <Popup open>
      <Popup.Container className="w-100! h-65! max-w-50">
        <Popup.Header title="Sort" onClose={closePopup} />

        <Popup.Body className="px-4 py-4 flex flex-col gap-4">
          {/* Column */}
          <Select
            label="Column"
            options={seriesConfig}
            getLabel={(o) => o.label}
            getKey={(o) => o.field}
            value={draft.key}
            onChange={(o) => setDraft({ key: o.field, operator: "none" })}
          />
          <Select
            label="Sort Order"
            options={
              SORT_TYPE[schemasById?.[draft.key]?.semanticType] || ["none"]
            }
            getLabel={(o) => SORT_OPTIONS[o]}
            value={draft.operator}
            onChange={(o) => setDraft((p) => ({ ...p, operator: o }))}
          />
        </Popup.Body>

        <Popup.Footer
          text={["Clear", "Apply"]}
          onCancel={() => {
            setDraft({ key: null, operator: "none" });
            clearSort(chartId);
          }}
          onApply={() => {
            applySort(chartId, draft.key, draft.operator);
          }}
        />
      </Popup.Container>
    </Popup>
  );
}
