import { useTradeSetupStore } from "@shared/stores";
import { AddSetupFieldPopup } from "./AddSetupFieldPopup";
import { EditSetupPopup } from "./EditSetupPopup";
import { Popup } from "@shared/components/layout";

export function Popups() {
  const activePopup = useTradeSetupStore((s) => s.activePopup);

  if (activePopup.id === null) return null;

  const getActivePopup = () => {
    if (activePopup.id === "field-add") {
      return <AddSetupFieldPopup setupId={activePopup.activeSetupId} />;
    }

    return <EditSetupPopup setupId={activePopup.activeSetupId} />;
  };

  return <Popup open>{getActivePopup()}</Popup>;
}
