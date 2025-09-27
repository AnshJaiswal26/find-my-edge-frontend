import { useCallback } from "react";
import useOptionPriceTracker from "../hooks/useOptionPriceTracker";
import { OptionSelector } from "./OptionSelector";
import { usePriceTrackerStore } from "../store/usePriceTrackerStore";

export default function TrackerContent({ observerRef }) {
  const isMinimized = usePriceTrackerStore((s) => s.isMinimized);
  const stockSymbol = usePriceTrackerStore((s) => s.stockSymbol);

  if (isMinimized) return null;

  return (
    <div className="tracker-content">
      {/* Symbol Header */}
      <div className="tracker-section">
        <span className="symbol-name">{stockSymbol}</span>
      </div>

      <OptionPriceSection />

      <StrikePriceSection />

      <ControlsSection observerRef={observerRef} />
    </div>
  );
}

function OptionDirectionSelector() {
  const selectedOption = usePriceTrackerStore((s) => s.selectedOption);
  const updateSelection = usePriceTrackerStore((s) => s.updateField);
  const isTracking = usePriceTrackerStore((s) => s.isTracking);

  return (
    <OptionSelector
      selectedOption={selectedOption}
      updateSelection={updateSelection}
      isTracking={isTracking}
    />
  );
}

function OptionPriceSection() {
  const price = usePriceTrackerStore((s) => s.price);
  const lastPrice = usePriceTrackerStore((s) => s.lastPrice);
  const change = price - lastPrice;

  return (
    <div className="tracker-section">
      <div className="section-label">Option Price</div>

      <div className="strike-input-group">
        <div className="price-direction-selector">
          <div
            className={`current-price ${change < 0 ? `negative` : `positive`}`}
          >
            {price.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <OptionDirectionSelector />
        </div>
      </div>
    </div>
  );
}

function StrikePriceSection() {
  const updateField = usePriceTrackerStore((s) => s.updateField);
  const strikePrice = usePriceTrackerStore((s) => s.strikePrice);
  const isTracking = usePriceTrackerStore((s) => s.isTracking);

  return (
    <div className="tracker-section">
      <div className="section-label">Strike Price</div>
      <div className="strike-input-group">
        <input
          type="number"
          className={`strike-input ${isTracking ? `grey-input` : ""}`}
          value={strikePrice}
          placeholder="Enter strike price"
          step="0.05"
          disabled={isTracking}
          onChange={(e) => updateField("strikePrice", e.target.value)}
        />
      </div>
    </div>
  );
}

function ControlsSection({ observerRef }) {
  const updateField = usePriceTrackerStore((s) => s.updateField);
  const isTracking = usePriceTrackerStore((s) => s.isTracking);
  const strikePrice = usePriceTrackerStore((s) => s.strikePrice);

  const findStrkePrice = useOptionPriceTracker();

  const handleStrikeTrack = useCallback(() => {
    if (strikePrice && !isTracking) {
      updateField("isTracking", true);
      findStrkePrice(strikePrice, observerRef);
    }
  }, [strikePrice, isTracking, updateField, findStrkePrice]);

  const handleDisconnect = useCallback(() => {
    updateField("isTracking", false);
    observerRef.current?.disconnect();
    observerRef.current = null;
  }, [updateField]);

  return (
    <div className="controls-section">
      {!isTracking ? (
        <button
          className="track-btn btn-primary"
          onClick={handleStrikeTrack}
          disabled={!strikePrice}
        >
          Track
        </button>
      ) : (
        <button className="track-btn btn-danger" onClick={handleDisconnect}>
          Disconnect
        </button>
      )}
    </div>
  );
}
