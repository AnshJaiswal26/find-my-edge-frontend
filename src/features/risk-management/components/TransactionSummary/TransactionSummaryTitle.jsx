import { useRiskManagementStore } from "../../stores";
import { SECTION_COLOR, SECTION_LABELS } from "../../constants";

export function TransactionSummaryTitle() {
  const transaction = useRiskManagementStore((s) => s.currentTransaction);

  return (
    <span className="text-lg">
      Transaction Summary For{" "}
      <span className={SECTION_COLOR[transaction]}>
        {SECTION_LABELS[transaction]}
      </span>
    </span>
  );
}
