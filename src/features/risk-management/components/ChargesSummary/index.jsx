import { Section } from "@shared/components/layout";
import { useChargesLogic } from "../../hooks";
import { toast } from "@shared/services/toast.service";
import { hideTooltip, showTooltip } from "@shared/components/ui/tooltip";
import { Button } from "@shared/components/ui";
import { Minus, Plus } from "lucide-react";
import { ChargesSummaryList } from "./ChargesSummaryList";

export function ChargesSummary() {
  const charges = useChargesLogic();

  return (
    <Section
      title={
        <div className="flex justify-between items-center">
          <span>Charges Summary</span>
          <div className="flex gap-2 items-center justify-end">
            <label className="risk-label">Charges</label>
            <Button.Icon
              onClick={() => {
                charges("added");
                toast.success("Charges added");
              }}
              onMouseEnter={(e) =>
                showTooltip(e, { content: "Include Charges" })
              }
              onMouseLeave={hideTooltip}
            >
              <Plus size={16} />
            </Button.Icon>
            <Button.Icon
              onClick={() => {
                charges("removed");
                toast.success("Charges removed");
              }}
              onMouseEnter={(e) =>
                showTooltip(e, { content: "Exclude Charges" })
              }
              onMouseLeave={hideTooltip}
            >
              <Minus size={16} />
            </Button.Icon>
          </div>
        </div>
      }
    >
      <ChargesSummaryList />
    </Section>
  );
}
