import { ErrorText, Section } from "@layout";
import { Input } from "@ui";
import { Trash2 } from "lucide-react";

export default function SelectOptionsEditor({ error, options, onChange }) {
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
    <Section>
      <div className="text-xs text-(--muted)">Options</div>

      {options.map((opt, i) => (
        <div key={i} className="flex items-center gap-2 mb-2">
          <Input
            size="sm"
            value={opt}
            placeholder={`Option ${i + 1}`}
            onCommit={(v) => updateOption(i, v)}
          />

          <button
            onClick={() => removeOption(i)}
            className="text-(--text) hover:text-red-500"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}

      <div>
        <button
          onClick={addOption}
          className="text-xs text-(--info) cursor-pointer hover:underline"
        >
          + Add option
        </button>
      </div>
      {error?.select && <ErrorText text={error.select} />}
    </Section>
  );
}
