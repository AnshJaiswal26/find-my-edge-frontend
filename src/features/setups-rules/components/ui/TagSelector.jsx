import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TAG_STYLES } from "./tagStyles";

const tags = ["GOOD", "VERY_GOOD", "EXCELLENT", "BAD", "VERY_BAD", "WORST"];

const iconClass =
  "text-(--text) px-2 cursor-pointer hover:bg-(--surface-muted) rounded transition";

export function TagSelector({ value, onChange }) {
  const [index, setIndex] = useState(Math.max(tags.indexOf(value), 0));

  useEffect(() => {
    const i = tags.indexOf(value);
    if (i !== -1) setIndex(i);
  }, [value]);

  const handleChange = (change) => {
    const newIndex = (index + change + tags.length) % tags.length;

    setIndex(newIndex);
    onChange?.(tags[newIndex]);
  };

  return (
    <div
      className="
        flex items-center
        min-w-[180px]
        border border-(--border)
        rounded-md overflow-hidden
        select-none
        shadow-sm
      "
    >
      {/* Left */}
      <button className={iconClass} onClick={() => handleChange(-1)}>
        <ChevronLeft size={18} />
      </button>

      {/* Tag */}
      <span
        className={`
            flex-1 text-center font-semibold text-sm
            py-2 px-3
            transition-all duration-200
            ${TAG_STYLES[tags[index]]}
          `}
      >
        {tags[index].replace("_", " ")}
      </span>

      {/* Right */}
      <button className={iconClass} onClick={() => handleChange(1)}>
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
