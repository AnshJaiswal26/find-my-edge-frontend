export const Cell = ({
  children,
  align = "left",
  header = false,
  positive,
  width,
}) => (
  <div
    style={{ width }}
    className={`px-2 py-2 flex w-full items-center min-w-0 flex-none
      whitespace-nowrap overflow-hidden text-ellipsis border-r border-(--border)
      ${align === "right" ? "justify-end text-right" : "justify-start text-left"}
      ${
        header
          ? "text-(--text-muted) font-semibold text-xs uppercase tracking-wide"
          : "text-sm"
      }
      ${
        positive == null
          ? "text-(--text)"
          : positive
            ? "text-(--success)"
            : "text-(--error)"
      }
    `}
  >
    <span className="truncate w-full">{children}</span>
  </div>
);
