import { Button } from "@shared/components/ui";
import { Container } from "@shared/components/layout";
import { Input } from "@features/risk-management/components";
import { useRiskManagementStore } from "@features/risk-management/stores";
import { Settings2 } from "lucide-react";

export function CapitalInputContainer() {
  const updateSettings = useRiskManagementStore((s) => s.updater.settings);

  return (
    <Container>
      <div className="flex justify-between items-center">
        <div className="relative">
          <Input
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
