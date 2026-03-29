import { FIELD_LABELS } from "@features/risk-management/constants";

export function InputFields({ selectedField, updateSettings, mainFields }) {
  return (
    <div className="space-y-1">
      <div className="text-(--success)">
        <span> ✏️ Input Fields - {mainFields.length}</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {mainFields.map((field) =>
          field === "suggestedQty" || field === "adjustedSl" ? null : (
            <div
              key={field}
              className={`bg-(--success-soft) p-3 rounded border-2 border-(--success-soft) ${
                field === selectedField ? "!border-(--success)" : ""
              }`}
              onClick={() => {
                updateSettings({ selectedField: field });
              }}
            >
              <div className="text-(--text)">{FIELD_LABELS[field]}</div>
              <div className="text-(--text-muted) text-xs">Editable</div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
