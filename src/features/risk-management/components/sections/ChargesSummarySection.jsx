import { Section } from "@shared/components/layout";
import { useRiskManagementStore } from "../../stores";
import { useChargesLogic, useTradeSummary } from "../../hooks";
import { toast } from "@shared/services/toast.service";
import { hideTooltip, showTooltip } from "@shared/components/ui/tooltip";
import { Button } from "@shared/components/ui";
import { formatINR } from "../../utils";
import { Minus, Plus } from "lucide-react";

export default function ChargesSummarySection() {
  console.log("ChargesSummarySection...");

  return (
    <Section
      title={
        <div className="flex justify-between items-center">
          <span>Charges Summary</span>
          <div className="flex gap-2 items-center justify-end">
            <label className="risk-label">Charges</label>
            <ToggleChargesButtons />
          </div>
        </div>
      }
    >
      <ChargesSummaryList />
    </Section>
  );
}

function ToggleChargesButtons() {
  const active = useRiskManagementStore((s) => s.anyTooltipActive);
  const charges = useChargesLogic();

  return (
    <>
      <Button.Icon
        onClick={() => {
          charges("added");
          toast.success("Charges added");
        }}
        onMouseEnter={(e) => showTooltip(e, { content: "Include Charges" })}
        onMouseLeave={hideTooltip}
      >
        <Plus size={16} />
      </Button.Icon>
      <Button.Icon
        onClick={() => {
          charges("removed");
          toast.success("Charges removed");
        }}
        onMouseEnter={(e) => showTooltip(e, { content: "Exclude Charges" })}
        onMouseLeave={hideTooltip}
      >
        <Minus size={16} />
      </Button.Icon>
    </>
  );
}

function ChargesSummaryList() {
  const { chargesSummaryList } = useTradeSummary();

  return (
    <>
      {chargesSummaryList.map((item, idx) => (
        <div className="flex justify-between items-center" key={idx}>
          <span className="text-(--text-muted)">{item.label}</span>
          <span className="text-(--text-muted)">
            {typeof item.value === "number"
              ? formatINR(item.value || 0)
              : item.value}
          </span>
        </div>
      ))}
    </>
  );
}
