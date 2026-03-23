import { GripVertical, Trash2 } from "lucide-react";

export const ToolbarSection = ({ children, className = "" }) => {
  return (
    <div className={`flex flex-row items-center gap-2 h-full ${className}`}>
      {children}
    </div>
  );
};

const StickyHeaderWrapper = ({ children, className, ...props }) => {
  return (
    <div
      {...props}
      className={`w-6 sticky z-10
        flex items-center justify-center
        bg-(--surface)
        border-r border-(--border)
        ${className}`}
    >
      {children}
    </div>
  );
};

export const RowWrapper = ({
  ref,
  children,
  index = 0,
  className,
  header = false,
  onPointerDown = () => null,
  onRemove = () => null,
}) => {
  return (
    <div
      ref={ref}
      {...(!header && { "data-row-header": true })}
      className={`
      flex border-y border-(--border) divide-x divide-(--border)
      ${header ? "bg-(--surface-disabled)" : ""}
      ${className}`}
    >
      <StickyHeaderWrapper
        className={`left-0 cursor-grab bg-(--surface-disabled)`}
        onPointerDown={onPointerDown}
      >
        <span>{!header ? index + 1 : ""}</span>

        {!header && (
          <AbsElementWrapper className="left-1 z-15 bg-(--surface-disabled)">
            <GripVertical size={16} />
          </AbsElementWrapper>
        )}
      </StickyHeaderWrapper>
      {children}

      <StickyHeaderWrapper
        className={`right-0 border-l bg-(--surface-disabled)`}
      >
        {!header && (
          <Trash2
            size={16}
            className="cursor-pointer hover:text-(--error)"
            onPointerDown={onRemove}
          />
        )}
      </StickyHeaderWrapper>
    </div>
  );
};

export const AbsElementWrapper = ({ children, className }) => {
  return (
    <div
      className={`
      absolute
      opacity-0
      border-0
      self-center
      group-hover:text-(--text-muted)
      group-hover:opacity-100
      ${className}`}
    >
      {children}
    </div>
  );
};

export const CellWrapper = ({ ref, children }) => {
  return (
    <div ref={ref} className="relative">
      {children}
    </div>
  );
};

export const EmptyStateWrapper = ({ children, className }) => {
  return (
    <div
      className={`flex w-full h-full items-center justify-center 
        rounded border border-(--border) 
        text-(--text-muted)
        text-sm
        ${className}`}
    >
      {children}
    </div>
  );
};
