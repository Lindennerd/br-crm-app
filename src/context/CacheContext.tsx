import { createContext, useContext } from "react";
import { childrenProp } from "../types/react.types";

interface IResponseCacheContext {
  responseCache: Map<string, any>;
  headers: Map<string, string>;
  clearCache: () => void;
}

const contextValue: IResponseCacheContext = {
  responseCache: new Map<string, any>(),
  headers: new Map<string, string>(),
  clearCache: () => {
    contextValue.responseCache.clear();
  },
};

const context = createContext<IResponseCacheContext>(contextValue);

export const useResponseCacheContext = () => useContext(context);

export const ResponseCacheContextProvider = ({ children }: childrenProp) => {
  const headers = new Map<string, string>();
  headers.set("Content-Type", "application/json");
  const responseCache = new Map<string, any>();
  return (
    <context.Provider
      value={{
        responseCache: responseCache,
        headers,
        clearCache: () => {
          responseCache.clear();
        },
      }}
    >
      {children}
    </context.Provider>
  );
};
