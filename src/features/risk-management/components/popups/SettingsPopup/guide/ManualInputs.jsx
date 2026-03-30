import { FIELD_LABELS } from "@features/risk-management/constants";

export function ManualInputs({ userDefined }) {
  return (
    <div>
      <div className="section-title input-title">
        🔢 Manual Inputs ({userDefined.length})
      </div>
      <div className="flex flex-col gap-3">
        {userDefined.map((field) =>
          field === "suggestedQty" || field === "adjustedSl" ? null : (
            <div
              className="bg-(--success-soft) p-3 rounded space-y-1 border border-(--success-soft)"
              key={field}
            >
              <div className="text-(--text) text-md">{FIELD_LABELS[field]}</div>
              <div className="bg-(--surface-muted) px-2 py-1.5 rounded border border-(--success)">
                <span className="text-(--text)">Manual / Last Change</span>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
