import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { UserSettingsProvider } from "./context/UserSettingsContext";
import { ThemeProvider } from "./context/ThemeContext";
import 'mapbox-gl/dist/mapbox-gl.css';
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <UserSettingsProvider>
        <App />
      </UserSettingsProvider>
    </ThemeProvider>
  </React.StrictMode>
);
