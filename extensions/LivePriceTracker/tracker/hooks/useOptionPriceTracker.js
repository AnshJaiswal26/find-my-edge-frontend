import { usePriceTrackerStore } from "../store/usePriceTrackerStore";

const parseFloatSafe = (text) => {
  const cleaned = text?.replace(/,/g, "").trim();
  const value = parseFloat(cleaned);
  return isNaN(value) ? null : value;
};

const extractPriceByStrike = (priceCell, strikePrice) => {
  const price = parseFloatSafe(priceCell?.textContent);

  if (price !== null) {
    const rounded = price.toFixed(2);
    console.log(`✅ Price for strike ${strikePrice}:`, rounded);

    chrome.runtime.sendMessage({
      type: "optionData",
      payload: {
        strike: strikePrice,
        price: rounded,
        source: window.location.href,
      },
    });

    // chrome.storage.local.set({
    //   livePriceData: {
    //     strike: strikePrice,
    //     price: rounded,
    //     source: window.location.href,
    //     timestamp: new Date().toISOString(),
    //   },
    // });

    return price;
  }

  console.warn(`❌ Could not find price for strike ${strikePrice}`);
};

export default function useOptionPriceTracker() {
  const selectedOption = usePriceTrackerStore((s) => s.selectedOption);
  const updatePrice = usePriceTrackerStore((s) => s.updateField);
  const updateFields = usePriceTrackerStore((s) => s.updateMultipleFields);

  const findStrkePrice = (strikePrice, observerRef) => {
    const stockName = document.querySelector(".stockName")?.textContent?.trim();
    const rows = document.querySelectorAll("table tr");

    for (const row of rows) {
      const cells = row.querySelectorAll("td");
      if (cells.length > 4) {
        const strikePriceCell = cells[4];
        const strikePriceText = strikePriceCell?.textContent
          .replace(/,/g, "")
          .trim();
        const isCorrectStrikePrice = strikePriceText.includes(strikePrice);
        if (isCorrectStrikePrice) {
          const i = selectedOption === "put" ? 6 : 2;
          const priceCell = cells[i];

          const price = extractPriceByStrike(priceCell, strikePriceText);

          if (observerRef.current) observerRef.current.disconnect();

          const observer = new MutationObserver(() => {
            const price = extractPriceByStrike(priceCell, strikePriceText);
            updatePrice("price", price);
          });
          observer.observe(priceCell, {
            subtree: true,
            characterData: true, // detect text changes
            childList: true, // detect if text node is replaced
          });
          observerRef.current = observer;

          updateFields([
            ["price", price],
            ["stockSymbol", stockName],
          ]);
          return;
        }
      }
    }
    console.log(`❌ Strike Price: ${strikePrice} not found`);
  };

  return findStrkePrice;
}
