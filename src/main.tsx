import React from "react";
import ReactDOM from "react-dom/client";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import App from "./App.tsx";
import "./index.css";

// Only configure Amplify when real backend config exists
const hasAuthConfig = Boolean(
  outputs && Object.keys(outputs).length > 0 && (outputs as Record<string, unknown>).auth
);
if (hasAuthConfig) {
  Amplify.configure(outputs);
}

export { hasAuthConfig };

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
