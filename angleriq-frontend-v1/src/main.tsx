import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { UserSettingsProvider } from "./context/UserSettingsContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <UserSettingsProvider>
      <App />
    </UserSettingsProvider>
  </React.StrictMode>
);
