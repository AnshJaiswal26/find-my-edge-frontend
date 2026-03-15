import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./styles/index.css";
import "gridstack/dist/gridstack.min.css";

import { enableMapSet } from "immer";

enableMapSet();

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  //</StrictMode>
);
