import { useEffect, useState } from "react";
import { BASE_CLASS } from "./baseClasses";

const toParts = (seconds = 0) => ({
  h: Math.floor(seconds / 3600),
  m: Math.floor((seconds % 3600) / 60),
  s: seconds % 60,
});

const toSeconds = ({ h, m, s }) => h * 3600 + m * 60 + s;
const pad2 = (n) => String(n).padStart(2, "0");

export function DurationInput({
  value = 0,
  sizes,
  onChange,
  onCommit,
  classNames,
}) {
  const commitMode = typeof onCommit === "function";
  const [local, setLocal] = useState(toParts(value));

  useEffect(() => {
    setLocal(toParts(value));
  }, [value]);

  const update = (e, next) => {
    // Convert current + edited values into total seconds
    const totalSeconds =
      (next.h ?? 0) * 3600 + (next.m ?? 0) * 60 + (next.s ?? 0);

    // Optional hard limits
    const clampedSeconds = Math.max(0, totalSeconds);

    // Normalize back into h:m:s
    const normalized = toParts(clampedSeconds);

    commitMode ? setLocal(normalized) : onChange?.(e, clampedSeconds);
  };

  const commit = () => {
    onCommit?.(toSeconds(local));
  };

  const inputClass = `
    ${BASE_CLASS}
    border-0!
    max-w-10! min-w-5!
    text-left p-2!
    ${sizes?.input}
  `;

  return (
    <div>
      <div className="text-[0.65rem] text-(--text-muted) ml-2 flex justify-start space-x-10">
        <span>hh</span>
        <span>mm</span>
        <span>ss</span>
      </div>
      <div
        className={`
        flex items-center gap-1
        border border-(--border) rounded
        focus-within:border-(--info)
        ${classNames?.input}
      `}
      >
        <input
          type="number"
          value={pad2(local.h)}
          placeholder="hh"
          className={inputClass}
          onChange={(e) => update(e, { ...local, h: Number(e.target.value) })}
          onBlur={commit}
        />
        :
        <input
          type="number"
          value={pad2(local.m)}
          placeholder="mm"
          className={inputClass}
          onChange={(e) => update(e, { ...local, m: Number(e.target.value) })}
          onBlur={commit}
        />
        :
        <input
          type="number"
          value={pad2(local.s)}
          placeholder="ss"
          className={inputClass}
          onChange={(e) => update(e, { ...local, s: Number(e.target.value) })}
          onBlur={commit}
        />
      </div>
    </div>
  );
}
