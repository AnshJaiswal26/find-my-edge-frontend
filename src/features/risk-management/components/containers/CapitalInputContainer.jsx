import { IconButton } from "@ui";
import { Container } from "@layout";
import RenderLogger from "@Profiler";
import { Input } from "@features/risk-management/components";
import { useRiskManagementStore } from "@features/risk-management/stores";
import { LucideSettings2 } from "lucide-react";

export function CapitalInputContainer() {
  const updateSettings = useRiskManagementStore((s) => s.updater.settings);

  return (
    // <RenderLogger id={"CapitalInputContainer"} why={"updateSettings"}>
    <Container>
      <div className="flex justify-between items-center">
        <div className="relative">
          <Input
            label={"Trading Capital"}
            sectionName={"capital"}
            field={"current"}
          />
        </div>
        <IconButton
          src="Icons/others/adjust.png"
          onClick={() => updateSettings({ showPanel: true })}
        />
      </div>
    </Container>
    // </RenderLogger>
  );
}
