import { Button, ConfirmationPopup, Toast } from "@shared/components/ui";
import { X } from "lucide-react";
import { Header, Sidebar } from "@shared/components/features";

export const PageContainer = ({
  children,
  className = "",
  editor = true,
  sidebar = true,
}) => {
  return (
    <div
      id={"app-container"}
      className="w-full h-screen overflow-x-hidden overflow-y-auto relative"
    >
      {sidebar && <Sidebar />}
      <div
        className={`flex flex-col justify-center items-center font-(--font-faimily-base) w-full h-fit box-border ${className}`}
      >
        <Toast />
        <ConfirmationPopup />

        {editor && <Header />}
        <div className="box-border flex-wrap p-5 bg-(--surface) w-full h-full max-w-[1350px] overflow-x-auto overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export const Container = ({
  id,
  children,
  className = "",
  title,
  header,
  childClassName = "",
}) => {
  return (
    <div
      id={id}
      className={`
        min-w-[360px]
        flex
        rounded-[7px]
        h-full
        p-2
        sm:p-3
        md:p-5
        box-border
        text-(--text)
        bg-(--surface-muted)
        border border-(--border-muted)
        shadow-[0_4px_8px_rgba(0,0,0,0.1)]
        relative
        overflow-hidden
        ${className}
      `}
    >
      <div className="flex flex-col flex-1 gap-[0.65rem] min-w-0 min-h-0 w-full h-full">
        {(title || header) && (
          <div className="flex items-center justify-between">
            {title && (
              <div className="text-[1.2rem] font-semibold mb-1.5">{title}</div>
            )}
            {header && <div>{header}</div>}
          </div>
        )}

        <div
          className={`flex flex-col flex-1 gap-[0.65rem] min-w-0 min-h-0 h-full ${childClassName}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export const Section = ({ title, children, subSection = false, className }) => {
  return (
    <div
      className={`
        border border-(--border)
        rounded-[5px]
        p-3
        ${
          subSection
            ? "border-0 border-t border-(--border) rounded-none px-2 py-3"
            : ""
        } ${className}
      `}
    >
      {title && (
        <h3
          className="
            text-[0.75rem]
            font-semibold
            text-(--text-muted)
            mb-3
            tracking-wider
          "
        >
          {title}
        </h3>
      )}

      <div className="flex flex-col gap-3 text-sm relative">{children}</div>
    </div>
  );
};

export const Popup = ({ open = true, children, className = "" }) => {
  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-[1000] flex w-full h-full items-center justify-center bg-black/40 ${className}`}
    >
      {children}
    </div>
  );
};

Popup.Container = ({ children, className = "", large = false }) => {
  return (
    <div
      className={`
        bg-(--surface-muted)
        rounded-lg
        w-full
        m-4
        shadow-[0_10px_25px_rgba(0,0,0,0.15)]
        h-[80vh]
        max-w-[29rem]
        overflow-hidden
        flex flex-col
        text-(--text-charts)
        ${large ? "max-w-[48rem]" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

Popup.Header = ({ title, onClose, disabled, children }) => {
  return (
    <header className="p-[15px] border-b border-(--border) flex items-center justify-between">
      <div>{title}</div>

      {onClose && (
        <Button.Icon
          aria-label="Close"
          className="hover:text-(--error)"
          onClick={onClose}
          disabled={disabled}
        >
          <X size={16} className="text-inherit" />
        </Button.Icon>
      )}

      {children}
    </header>
  );
};

Popup.Body = ({ children, className = "" }) => {
  return (
    <main
      className={`
        flex-1
        overflow-y-auto
        overscroll-contain
        px-2 py-1
        ${className}
      `}
    >
      {children}
    </main>
  );
};

Popup.Footer = ({
  text = ["Cancel", "Apply"],
  onCancel,
  onApply,
  disableCancel = false,
  disableApply = false,
  loading = { cancel: false, apply: false },
  classNames,
}) => {
  return (
    <footer
      className={`
        p-[15px]
        border-t border-(--border)
        flex justify-end gap-4
        ${classNames?.footer}
      `}
    >
      {onCancel && (
        <Button
          text={text[0]}
          onClick={onCancel}
          hollow
          loading={loading.cancel}
          disabled={disableCancel || loading?.cancel}
          classNames={{ button: classNames?.cancelBtn }}
        />
      )}
      {onApply && (
        <Button
          text={text[1]}
          onClick={onApply}
          loading={loading.apply}
          disabled={disableApply || loading?.apply}
          classNames={{ button: classNames?.applyBtn }}
        />
      )}
    </footer>
  );
};

Popup.ActionsFooter = ({ fnMap = {}, className = "" }) => {
  const entries = Object.entries(fnMap);
  const firstRightIndex = entries.findIndex(([, p]) => p?.align === "right");

  return (
    <footer
      className={`
        p-[15px]
        border-t border-(--border)
        flex items-center gap-2
        ${className}
      `}
    >
      {entries.map(([label, p], idx) => (
        <Button
          key={label}
          text={label}
          onClick={p?.fn}
          disabled={p?.disabled}
          loading={p?.loading}
          classNames={{
            wrapper:
              p?.align === "right" && idx === firstRightIndex
                ? "ml-auto"
                : p?.className,
          }}
        />
      ))}
    </footer>
  );
};

export const ChartPopup = ({
  title,
  children,
  isVisible,
  text,
  onCancel = () => null,
  onApply = () => null,
  onClose = () => null,
  className = "",
}) => {
  if (!isVisible) return null;

  return (
    <div
      className="
        absolute right-full -top-[2px]
        z-500
        flex flex-col
        h-fit w-fit
        min-w-[210px] max-h-[400px]
        bg-(--surface)
        border border-(--border)
        rounded-[4px]
        shadow-[0_0_6px_rgba(0,0,0,0.192)]
      "
    >
      {/* Header */}
      <header className="flex items-center justify-between p-[10px] border-b border-(--hover)">
        <span>{title}</span>
        <button
          type="button"
          onClick={onClose}
          className="p-[0.2rem] hover:text-(--danger) hover:bg-(--hover) hover:rounded-[5px]"
        >
          <X size={14} />
        </button>
      </header>

      {/* Main */}
      <main
        className={`
          flex flex-col
          text-[0.78rem]
          px-1 py-[10px]
          max-h-[200px] max-w-[350px]
          overflow-y-auto
          ${className}
        `}
      >
        {children}
      </main>

      {/* Footer */}
      <footer className="flex justify-end gap-2 p-[10px] border-t border-(--hover)">
        <Button
          text={text?.[0] || "Cancel"}
          variant="hollow"
          color={"var(--hover)"}
          className="text-(--text)!"
          size="small"
          onClick={onCancel}
        />
        <Button
          text={text?.[1] || "Apply"}
          size="small"
          onClick={onApply}
          className="text-white"
        />
      </footer>
    </div>
  );
};
