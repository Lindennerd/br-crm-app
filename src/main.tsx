import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";
import { MenuContextProvider } from "./context/MenuContext";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <MenuContextProvider>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </MenuContextProvider>
  </React.StrictMode>
);
