import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { AuthProvider } from "../../../backend/src/provider/AuthProvider";
import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);