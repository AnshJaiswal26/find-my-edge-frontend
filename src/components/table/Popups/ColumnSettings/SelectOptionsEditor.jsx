import { Plus, Trash2 } from "lucide-react";

export function SelectOptionsEditor({ options, onChange }) {
  function updateOption(index, value) {
    const next = [...options];
    next[index] = value;
    onChange(next);
  }

  function addOption() {
    onChange([...options, ""]);
  }

  function removeOption(index) {
    const next = options.filter((_, i) => i !== index);
    onChange(next);
  }

  return (
    <div className="space-y-2">
      <div className="text-xs text-(--muted)">Options</div>

      {options.map((opt, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            className="
              flex-1
              bg-(--surface)
              border border-(--border)
              px-2 py-1
              text-sm
            "
            value={opt}
            placeholder={`Option ${i + 1}`}
            onChange={(e) => updateOption(i, e.target.value)}
          />

          <button
            onClick={() => removeOption(i)}
            className="text-(--muted) hover:text-red-500"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}

      <button
        onClick={addOption}
        className="flex items-center gap-1 text-xs text-(--info)"
      >
        <Plus size={14} /> Add option
      </button>
    </div>
  );
}
