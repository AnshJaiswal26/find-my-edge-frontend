import { useGlobalEvents, useResolvedValue } from "@shared/hooks";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { createPortal } from "react-dom";

export default function Select({
  label,
  options,
  value,
  onChange = () => null,
  store,
  classNames = {},
  getLabel = (v) => v,
  getKey = (v) => v,
  vertical = false,
}) {
  const [active, setActive] = useState(false);

  const buttonRef = useRef(null);
  const listRef = useRef(null);

  const val = useResolvedValue(store, value);

  const [pos, setPos] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    width: 0,
    maxHeight: 0,
    placement: "",
  });

  useLayoutEffect(() => {
    if (!active || !buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;

    const MIN_HEIGHT = window.innerHeight / 2;

    const openDown = spaceBelow >= MIN_HEIGHT || spaceBelow >= spaceAbove;

    setPos({
      placement: openDown ? "bottom" : "top",
      top: openDown ? rect.bottom + 3 : undefined,
      bottom: openDown ? undefined : viewportHeight - rect.top + 3,
      left: rect.left,
      width: rect.width,
      shadow: openDown
        ? "0 10px 20px hsla(0, 0%, 0%, 0.3)"
        : "0 -10px 20px hsla(0, 0%, 0%, 0.3)",
      maxHeight: Math.max(100, (openDown ? spaceBelow : spaceAbove) - 8),
    });
  }, [active]);

  const selectedItem = useMemo(
    () => options?.find((o) => getKey(o) === val) ?? null,
    [val],
  );

  return (
    <div
      className={`
        flex items-center gap-1 flex-wrap
        text-sm
        ${classNames?.wrapper}
        ${vertical ? "flex-col items-start!" : ""}
      `}
    >
      {label && <label className="shrink-0 w-32">{label}</label>}

      <div
        className={`relative flex flex-1 justify-start sm:justify-end ${
          !label || vertical ? "justify-start!" : ""
        }`}
      >
        <button
          ref={buttonRef}
          className={`
            flex items-center justify-between
            px-3 py-2
            rounded
            border border-(--border)
            min-w-50 
            box-border
            text-nowrap
            ${active ? "border-(--info)!" : ""}
            ${classNames?.button}
          `}
          onClick={(e) => {
            setActive((p) => !p);
            e.preventDefault();
          }}
        >
          <span>{selectedItem ? getLabel(selectedItem) : "Select"}</span>

          <ChevronDown
            size={14}
            className={`transition-all duration-300 ${
              active ? "rotate-180" : ""
            }`}
          />
        </button>

        {active &&
          createPortal(
            <Options
              buttonRef={buttonRef}
              listRef={listRef}
              options={options}
              setActive={setActive}
              getLabel={getLabel}
              onChange={onChange}
              classNames={classNames}
              pos={pos}
            />,
            document.body,
          )}
      </div>
    </div>
  );
}

function Options({
  buttonRef,
  listRef,
  options,
  getLabel,
  onChange,
  setActive,
  classNames,
  pos,
}) {
  useGlobalEvents(
    ["pointerdown", "resize", "scroll", "visibilitychange"],
    (e) => {
      const target = e.target;
      if (target.nodeType === Node.ELEMENT_NODE) {
        if (
          buttonRef.current?.contains?.(target) ||
          listRef.current?.contains?.(target)
        )
          return;
      }
      setActive(false);
    },
  );

  return (
    <div
      ref={listRef}
      className={`
                fixed 
                w-full
                flex flex-col
                rounded-tl rounded-bl
                border border-(--border)
                bg-(--surface-muted)
                text-(--text)
                text-sm
                min-w-25
                overflow-y-auto
                box-border
                z-10000
                 ${
                   pos.placement === "top"
                     ? "origin-bottom rounded-b"
                     : "origin-top rounded-t"
                 }
                ${classNames?.list}
              `}
      style={{
        top: pos.top,
        bottom: pos.bottom,
        left: pos.left,
        width: pos.width,
        maxHeight: pos.maxHeight,
        boxShadow: pos.shadow,
      }}
    >
      {options.map((item, i) => (
        <button
          key={i}
          className={`
                    text-left
                    w-full
                    px-3 py-2
                    border-b border-(--hover)
                    last:border-b-0
                    hover:bg-(--info)
                    hover:text-white
                    ${classNames?.button}
                  `}
          onClick={() => {
            onChange(item, i);
            setActive(false);
          }}
        >
          {getLabel(item)}
        </button>
      ))}
    </div>
  );
}
