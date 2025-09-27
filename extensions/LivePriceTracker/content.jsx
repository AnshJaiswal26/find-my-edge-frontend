import React from "react";
import { createRoot } from "react-dom/client";
import LivePriceTracker from "./tracker/PriceTracker";
import "./PriceTracker.css";

function injectReactApp(component) {
  const container = document.createElement("div");
  container.id = "price-tracker-extension-root";
  document.body.appendChild(container);
  const root = createRoot(container);
  root.render(component);
}

if (window.location.href.includes("web.dhan.co/index/indices")) {
  injectReactApp(<LivePriceTracker />);
}
