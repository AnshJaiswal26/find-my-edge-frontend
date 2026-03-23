import { useTradeSetupStore } from "@shared/stores";
import { AddSetupFieldPopup } from "./AddSetupFieldPopup";
import { EditSetupPopup } from "./EditSetupPopup";
import { Popup } from "@shared/components/layout";
import { AddSetupPopup } from "./AddSetupPopup";

export function Popups() {
  const activePopup = useTradeSetupStore((s) => s.activePopup);

  if (activePopup.id === null) return null;

  const getActivePopup = () => {
    switch (activePopup.id) {
      case "setup-add":
        return <AddSetupPopup setupId={activePopup.activeSetupId} />;
      case "field-add":
        return <AddSetupFieldPopup setupId={activePopup.activeSetupId} />;
      default:
        return <EditSetupPopup setupId={activePopup.activeSetupId} />;
    }
  };

  return <Popup open>{getActivePopup()}</Popup>;
}
