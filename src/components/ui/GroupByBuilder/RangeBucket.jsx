import { Divider, Section } from "@layout";
import { Button, RangeInput } from "@ui";
import { Trash2 } from "lucide-react";

export function RangeBucket({ draft, setDraft, schema }) {
  if (draft.bucket !== "range") return null;

  return (
    <Section>
      {draft.ranges.length === 0 ? (
        <div className="flex-1 mt-5 text-center text-(--text-muted)">
          Add a range
        </div>
      ) : (
        draft.ranges.map((range, index) => (
          <div key={index} className="space-y-2">
            {index !== 0 && <Divider />}
            <span className="text-xs uppercase text-(--text-muted)">
              Range {index + 1}
            </span>
            <div className="flex items-end space-x-2" key={index}>
              <RangeInput
                key={index}
                type={schema.input}
                value={range}
                onChange={(range) =>
                  setDraft((p) => {
                    const next = [...p.ranges];
                    next[index] = range;
                    return { ...p, ranges: next };
                  })
                }
              />
              <Button.Icon
                onClick={() =>
                  setDraft((p) => ({
                    ...p,
                    ranges: p.ranges.filter((_, i) => i !== index),
                  }))
                }
              >
                <Trash2 size={18} />
              </Button.Icon>
            </div>
          </div>
        ))
      )}
      <div>
        <Button.Text
          onClick={() =>
            setDraft((p) => ({
              ...p,
              ranges: [...p.ranges, { from: 0, to: 0 }],
            }))
          }
        >
          + Add range
        </Button.Text>
      </div>
    </Section>
  );
}
