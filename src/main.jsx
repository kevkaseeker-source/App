import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { App as CapacitorApp } from "@capacitor/app";

function handleDeepLink(url) {
  if (!url) return;

  try {
    const parsed = new URL(url);

    if (parsed.protocol === "staex:" && parsed.hostname === "damage-result") {
      const status = parsed.searchParams.get("status");
      const txHash = parsed.searchParams.get("txHash");
      const proofId = parsed.searchParams.get("proofId");
      const imageUrl = parsed.searchParams.get("imageUrl");

      console.log("Deep link result:", {
        status,
        txHash,
        proofId,
        imageUrl,
      });

      // Später hier z. B. localStorage oder globalen State setzen
      localStorage.setItem(
        "damageResult",
        JSON.stringify({ status, txHash, proofId, imageUrl })
      );
    }
  } catch (error) {
    console.error("Failed to parse deep link:", error);
  }
}

// App wurde per Deep Link gestartet
CapacitorApp.getLaunchUrl().then((data) => {
  handleDeepLink(data?.url);
});

// App läuft bereits und bekommt einen neuen Deep Link
CapacitorApp.addListener("appUrlOpen", (data) => {
  handleDeepLink(data?.url);
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);