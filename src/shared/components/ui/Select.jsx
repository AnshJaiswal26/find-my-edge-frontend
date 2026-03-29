import { useFloatingPosition, useGlobalEvents } from "@shared/hooks";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { createPortal } from "react-dom";

export default function Select({
  label,
  options,
  value,
  onChange = () => null,
  classNames = {},
  getLabel = (v) => v,
  getKey = (v) => v,
  vertical = false,
}) {
  const buttonRef = useRef(null);
  const listRef = useRef(null);

  const [active, setActive] = useState(false);

  useFloatingPosition(active, buttonRef, listRef, {
    preferred: "bottom",
    offset: 3,
  });

  const selectedItem = useMemo(
    () => options?.find((o) => getKey(o) === value) ?? null,
    [value],
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

  useEffect(() => {
    listRef.current.style.width =
      buttonRef.current.getBoundingClientRect().width + "px";
  }, []);

  return (
    <div
      ref={listRef}
      className={`
        fixed 
        w-full
        flex flex-col
        rounded
        border border-(--border)
        bg-(--surface-muted)
        text-(--text)
        text-sm
        min-w-25
        overflow-y-auto
        box-border
        z-10000
        ${classNames?.list}
      `}
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
