import { Button } from "@shared/components/ui";
import { Container } from "@shared/components/layout";
import { CalculatorInput } from "./CalculatorInput";
import { useRiskManagementStore } from "../stores";
import { Settings2 } from "lucide-react";

export function CapitalInput() {
  const updateSettings = useRiskManagementStore((s) => s.updater.settings);

  return (
    <Container className="!min-h-fit">
      <div className="flex justify-between items-center">
        <div className="relative">
          <CalculatorInput
            label={"Trading Capital"}
            sectionName={"capital"}
            field={"current"}
          />
        </div>

        <Button.Icon onClick={() => updateSettings({ showPanel: true })}>
          <Settings2 size={16} />
        </Button.Icon>
      </div>
    </Container>
  );
}
