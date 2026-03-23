import { Popup } from "@shared/components/layout";
import { useTradeSetupStore } from "@shared/stores";
import { SetupFormBuilder } from "./SetupFormBuilder";

export function AddSetupPopup() {
  const addTradeSetup = useTradeSetupStore((s) => s.addTradeSetup);
  const isSubmitting = useTradeSetupStore((s) => s.isSubmitting);

  return (
    <Popup.Container>
      <SetupFormBuilder
        title={"Add Setup"}
        initialValues={{
          name: "",
          imageUrl: "",
          imagePublicId: "",
        }}
        isSubmiting={isSubmitting}
        onApply={(values, validate) => {
          if (validate()) {
            addTradeSetup(values);
          }
        }}
      />
    </Popup.Container>
  );
}
