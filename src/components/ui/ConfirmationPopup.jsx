import { Popup } from "@layout";

export default function ConfirmationPopup({
  open,
  title = "Confirm Action",
  message = "Are you sure you want to continue?",
  confirmText = "Yes",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
  danger = false,
}) {
  return (
    <Popup open={open}>
      <Popup.Container className="max-w-md h-auto">
        <Popup.Header title={title} onClose={onCancel} />

        <Popup.Body className="py-6 px-5 text-md leading-relaxed">
          <p className="text-(--text-muted)">{message}</p>
        </Popup.Body>

        <Popup.Footer
          text={[cancelText, confirmText]}
          onCancel={onCancel}
          onApply={onConfirm}
          disableApply={loading}
          disableCancel={loading}
          loading={{ apply: loading }}
          classNames={{
            applyBtn: "!bg-(--error) border !border-(--error)",
          }}
        />
      </Popup.Container>
    </Popup>
  );
}
