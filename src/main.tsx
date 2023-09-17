import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";
import { ResponseCacheContextProvider } from "./context/CacheContext";
import { MenuContextProvider } from "./context/MenuContext";
import { LoadingContextProvider } from "./context/LoadingContext";
import { CurrentClientContextProvider } from "./context/CurrentClientContext";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <LoadingContextProvider>
      <ResponseCacheContextProvider>
        <MenuContextProvider>
          <AuthContextProvider>
            <CurrentClientContextProvider>
              <App />
            </CurrentClientContextProvider>
          </AuthContextProvider>
        </MenuContextProvider>
      </ResponseCacheContextProvider>
    </LoadingContextProvider>
  </React.StrictMode>
);
