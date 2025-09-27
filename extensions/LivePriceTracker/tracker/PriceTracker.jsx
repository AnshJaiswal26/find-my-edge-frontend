import { useEffect, useMemo, useRef, useState } from "react";
import { PriceTrackerContainer } from "./layouts/PriceTrackerContainer";
import TrackerHeader from "./components/TrackerHeader";
import TrackerContent from "./components/TrackerContent";

import { usePriceTrackerStore } from "./store/usePriceTrackerStore";

export default function LivePriceTracker() {
  const observerRef = useRef();
  const isMinimized = usePriceTrackerStore((s) => s.isMinimized);

  // useEffect(() => {
  //   const injectStyles = () => {
  //     const style = document.createElement("style");
  //     style.textContent = cssText;
  //     document.head.appendChild(style);
  //   };

  //   if (document.readyState === "loading") {
  //     document.addEventListener("DOMContentLoaded", injectStyles);
  //   } else {
  //     injectStyles();
  //   }
  // }, []);

  return (
    <PriceTrackerContainer isMinimized={isMinimized}>
      <TrackerHeader />
      <TrackerContent observerRef={observerRef} />
    </PriceTrackerContainer>
  );
}
