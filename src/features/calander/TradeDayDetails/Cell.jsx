export const Cell = ({
  children,
  align = "left",
  header = false,
  positive,
}) => (
  <div
    className={`px-2 py-2 flex items-center text-nowrap overflow-ellipsis
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
    {children}
  </div>
);
