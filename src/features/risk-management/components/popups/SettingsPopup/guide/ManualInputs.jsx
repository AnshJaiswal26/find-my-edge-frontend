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
              <div className="field-name">{FIELD_LABELS[field]}</div>
              <div className="bg-white px-2 py-1.5 rounded">
                <span className="text-(--text-muted)">
                  Manual / Last Change
                </span>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
