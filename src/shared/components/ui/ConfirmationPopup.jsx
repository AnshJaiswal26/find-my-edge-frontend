import { Popup } from "@shared/components/layout";
import { useConfirmation } from "@shared/hooks";
import { confirmManager } from "@shared/components/ui/managers";

export default function ConfirmationPopup() {
  const config = useConfirmation();
  console.log("rendering confirmation popup", config);
  if (!config?.open) return null;

  return (
    <Popup open>
      <Popup.Container className="max-w-md h-auto">
        <Popup.Header
          title={config.title}
          disabled={config.loading}
          onClose={() => confirmManager.resolve("cancel")}
        />

        <Popup.Body className="py-6 px-5 text-md leading-relaxed text-center">
          <p className="text-(--text-muted)">{config.message}</p>
        </Popup.Body>

        <Popup.Footer
          text={[config.cancelText || "Cancel", config.confirmText || "Yes"]}
          onCancel={() => confirmManager.resolve("cancel")}
          onApply={() => confirmManager.resolve("confirm")}
          disableApply={config.loading}
          disableCancel={config.loading}
          loading={{ apply: config.loading }}
          classNames={{
            applyBtn: config.danger
              ? "!bg-(--error) border !border-(--error)"
              : "",
          }}
        />
      </Popup.Container>
    </Popup>
  );
}
