import { FIELD_LABELS } from "../../../../../../constants";

export default function Arrow({ selectedField }) {
  return (
    <>
      <div className="arrow-icon-wrapper">
        <span className="arrow-icon">↓</span>
        <span className="input-title">
          When you Change in ({FIELD_LABELS[selectedField]})
        </span>
      </div>
    </>
  );
}
