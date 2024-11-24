import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CssBaseline } from "@mui/material";
import App from "./app/App.tsx";
import { BrowserRouter as Router } from "react-router-dom";
import "./app/common.css";
import { Provider } from "react-redux";
import { store } from "./app";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CssBaseline />
    <Router>
      <Provider store={store}>
        <App />
      </Provider>
    </Router>
  </StrictMode>
);
