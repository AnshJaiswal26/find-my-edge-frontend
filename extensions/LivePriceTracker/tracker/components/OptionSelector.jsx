import { TrendingUp, TrendingDown } from "lucide-react";

export const OptionSelector = ({
  selectedOption,
  updateSelection,
  isTracking,
}) => {
  return (
    <div className="option-selector-container">
      <button
        onClick={() => updateSelection("selectedOption", "call")}
        className={`option-button call-button ${
          selectedOption === "call" ? "active" : ""
        }`}
        disabled={isTracking}
      >
        <TrendingUp
          className={`option-icon ${
            selectedOption === "call" ? "active-icon" : ""
          }`}
        />
        <span className="option-text">CE</span>
      </button>

      <button
        onClick={() => updateSelection("selectedOption", "put")}
        className={`option-button put-button ${
          selectedOption === "put" ? "active" : ""
        }`}
        disabled={isTracking}
      >
        <TrendingDown
          className={`option-icon ${
            selectedOption === "put" ? "active-icon" : ""
          }`}
        />
        <span className="option-text">PE</span>
      </button>
    </div>
  );
};
