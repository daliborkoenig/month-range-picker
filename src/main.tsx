import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { GlobalStyle } from "./globalStyles";
import moment from "moment-timezone";
moment.tz.setDefault("Europe/Berlin");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GlobalStyle />
    <App />
  </StrictMode>
);
