import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";
import { ResponseCacheContextProvider } from "./context/CacheContext";
import { MenuContextProvider } from "./context/MenuContext";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <ResponseCacheContextProvider>
      <MenuContextProvider>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </MenuContextProvider>
    </ResponseCacheContextProvider>
  </React.StrictMode>
);
