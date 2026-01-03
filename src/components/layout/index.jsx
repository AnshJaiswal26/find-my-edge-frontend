import { Button, Editor, Sidebar, Toast, Tooltip } from "@ui";
import { Loader2, X } from "lucide-react";

export const PageContainer = ({
  children,
  className = "",
  editor = true,
  sidebar = true,
}) => {
  return (
    <div>
      {sidebar && <Sidebar />}
      <Tooltip />
      <div
        className={`flex flex-col justify-center items-center font-(--font-faimily-base) w-full h-full box-border ${className}`}
      >
        <Toast />

        {editor && <Editor />}
        <div className="box-border flex-wrap p-5 bg-(--surface) w-full h-full max-w-[1350px] overflow-x-auto overflow-y-hidden">
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
        h-fit
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
      <div className="flex flex-col flex-1 gap-[0.65rem]">
        <div className="flex items-center justify-between">
          {title && (
            <div className="text-[1.2rem] font-semibold mb-1.5">{title}</div>
          )}
          {header && <div>{header}</div>}
        </div>

        <div className={`flex flex-col flex-1 gap-5 ${childClassName}`}>
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
        }
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
export const Legend = ({
  color,
  label,
  selected,
  onClick = () => null,
  className = "",
}) => {
  return (
    <div
      className={`flex items-center text-[0.93rem] text-[hsl(var(--text-charts))] ${className}`}
    >
      <div
        onClick={onClick}
        className={`
          flex items-center
          gap-[5px]
          px-1
          rounded-[5px]
          cursor-pointer
          ${selected ? "opacity-30" : ""}
        `}
      >
        {Array.isArray(color) ? (
          color.map((c, i) => (
            <div
              key={i}
              className="w-[0.9rem] h-[0.9rem] rounded-full"
              style={{ backgroundColor: c }}
            />
          ))
        ) : (
          <div
            className="w-[0.9rem] h-[0.9rem] rounded-full"
            style={{ backgroundColor: color }}
          />
        )}

        <span>{label}</span>
      </div>
    </div>
  );
};

export const Bar = ({ color, labels, fill }) => {
  return (
    <div className="w-full min-w-[180px] box-border">
      <div className="flex flex-wrap justify-between items-center w-full text-sm mb-2 text-(--text-charts)">
        {labels &&
          labels.map((label) => (
            <div>
              <span>{label}</span>
            </div>
          ))}
      </div>

      <div className="flex-1 h-[14px] bg-(--hover) overflow-hidden relative rounded-[6px]">
        <div
          className="h-full"
          style={{
            width: fill,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
};

export const Badge = ({ value, label, formatter, className = "" }) => {
  const v = Number(value);
  const formattedValue = formatter ? formatter(v) : v;

  const variant =
    v > 0
      ? "bg-(--success-soft) text-(--success) border border-(--success)"
      : v === 0
      ? "bg-(--warning) text-(--warning) border border-(--warning)"
      : "bg-(--error-soft) text-(--error) border border-(--error)";

  return (
    <div className="flex gap-1.5 items-center">
      {label && <span>{label}</span>}

      <span
        className={`
          rounded-full
          px-[6px] py-[3px]
          text-[0.88rem]
          ${variant}
          ${className}
        `}
      >
        {formattedValue}
      </span>
    </div>
  );
};

export const Popup = ({ open = true, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40">
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

Popup.Header = ({ title, onClose, children }) => {
  return (
    <header className="p-[15px] border-b border-(--border) flex items-center justify-between">
      <div>{title}</div>

      {onClose && (
        <Button.Icon
          aria-label="Close"
          className="hover:text-(--error)"
          onClick={onClose}
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
  className = "",
}) => {
  return (
    <footer
      className={`
        p-[15px]
        border-t border-(--border)
        flex justify-end gap-4
        ${className}
      `}
    >
      {onCancel && <Button hollow text={text[0]} onClick={onCancel} />}
      {onApply && <Button onClick={onApply} text={text[1]} />}
    </footer>
  );
};

Popup.MultiButtonFooter = ({ fnMap = {}, className = "" }) => {
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

export function Loader() {
  return (
    <div className="flex w-[100vw] h-[100vh] items-center justify-center">
      <Loader2 size={60} className="animate-spin" color="var(--text)" />
    </div>
  );
}

export const Divider = ({ vertical = false }) => {
  return (
    <div
      className={
        vertical
          ? "self-stretch border-l border-(--border)"
          : "w-full border-t border-(--border)"
      }
    />
  );
};
