import { useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { BarChart2, HighlighterIcon, Trash2 } from "lucide-react";
import { useGlobalEvents } from "@shared/hooks";

const MENU_ITEMS = [
  {
    id: "score",
    label: "View Score",
    icon: BarChart2,
    className: "text-(--text) hover:bg-(--hover)",
  },
  {
    id: "highlight",
    label: "Highlight Row",
    icon: HighlighterIcon,
    className: "text-yellow-400 hover:bg-yellow-500/10",
  },
  {
    id: "delete",
    label: "Delete Row",
    icon: Trash2,
    className: "text-red-400 hover:bg-red-500/10",
    dividerBefore: true,
  },
];

export function ContextMenu({ anchorRef, onAction, onClose }) {
  const menuRef = useRef(null);

  // Measure + apply position directly to DOM before paint — no state, no re-render
  useLayoutEffect(() => {
    const menu = menuRef.current;
    const anchor = anchorRef.current?.getBoundingClientRect();
    if (!menu || !anchor) return;

    const menuRect = menu.getBoundingClientRect();
    const MARGIN = 8;
    const viewportH = window.innerHeight;
    const viewportW = window.innerWidth;

    let top = anchor.top;
    if (top + menuRect.height + MARGIN > viewportH) {
      top = anchor.bottom - menuRect.height;
    }
    top = Math.max(MARGIN, Math.min(top, viewportH - menuRect.height - MARGIN));

    let left = anchor.right;
    if (left + menuRect.width + MARGIN > viewportW) {
      left = anchor.left - menuRect.width;
    }
    left = Math.max(
      MARGIN,
      Math.min(left, viewportW - menu.offsetWidth - MARGIN),
    );

    // Set position first
    menu.style.top = `${top}px`;
    menu.style.left = `${left}px`;

    // Then animate in — runs after position is committed
    requestAnimationFrame(() => {
      menu.style.opacity = "1";
      menu.style.transform = "scale(1)";
    });
  }, [anchorRef]);

  useGlobalEvents(["resize", "scroll", "pointerdown"], (e) => {
    const isFn = typeof menuRef.current.contains === "function";
    console.log(isFn);
    if (isFn && !menuRef.current.contains(e.target)) onClose();
    else if (!isFn) onClose();
  });

  return createPortal(
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        visibility: "visible",
        opacity: 0,
        transform: "scale(0.95)",
        transformOrigin: "top left",
        transition: "opacity 100ms ease, transform 100ms ease",
      }}
      className="
        z-[9999] min-w-44 py-1 rounded-lg
        bg-(--surface-muted) border border-(--border)
        shadow-lg shadow-black/20
      "
    >
      {MENU_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.id}>
            {item.dividerBefore && (
              <div className="my-1 border-t border-(--border)" />
            )}
            <button
              onClick={() => {
                onAction(item.id);
                onClose();
              }}
              className={`
                w-full flex items-center gap-2.5
                px-3 py-1.5 text-sm
                transition-colors cursor-pointer
                ${item.className}
              `}
            >
              <Icon size={14} />
              {item.label}
            </button>
          </div>
        );
      })}
    </div>,
    document.body,
  );
}
