import { usePriceTrackerStore } from "../store/usePriceTrackerStore";

export default function TrackerHeader({}) {
  const isTracking = usePriceTrackerStore((s) => s.isTracking);
  const isMinimized = usePriceTrackerStore((s) => s.isMinimized);
  const updateField = usePriceTrackerStore((s) => s.updateField);

  return (
    <div className="tracker-header">
      <div className="header-left">
        <div className="tracker-title">
          <span
            className={`live-indicator ${!isTracking ? "offline" : ""}`}
          ></span>
          Price Tracker
        </div>
      </div>
      <div className="header-controls">
        <button
          className="control-btn"
          onClick={() => updateField("isMinimized", !isMinimized)}
        >
          {isMinimized ? "+" : "−"}
        </button>
      </div>
    </div>
  );
}
