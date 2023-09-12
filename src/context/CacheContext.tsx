import { createContext, useContext } from "react";
import { childrenProp } from "../types/react.types";

interface IResponseCacheContext {
  headers: Map<string, string>;
  clearCache: () => void;
  setCache: (key: string, data: any, expiration: number) => void;
  getCache: (key: string) => any;
  hasKey: (key: string) => boolean;
}

export interface CacheData {
  data: any;
  setDate: Date;
  expiration: number;
}

const contextValue: IResponseCacheContext = {
  headers: new Map<string, string>(),
  clearCache: () => {},
  setCache: (key: string, data: any, expiration: number) => {},
  getCache: (key: string) => {},
  hasKey: (key: string) => false,
};

const context = createContext<IResponseCacheContext>(contextValue);

export const useResponseCacheContext = () => useContext(context);

export const ResponseCacheContextProvider = ({ children }: childrenProp) => {
  const headers = new Map<string, string>();
  headers.set("Content-Type", "application/json");
  const responseCache = new Map<string, any>();

  function setCache(key: string, data: any, expiration: number) {
    const cacheData: CacheData = {
      data,
      setDate: new Date(),
      expiration: new Date().getTime() + expiration,
    };
    responseCache.set(key, cacheData);
  }

  function getCache(key: string) {
    const cacheData = responseCache.get(key);
    if (!cacheData) return null;
    if (cacheData.expiration < 0) return cacheData.data;
    if (
      cacheData.setDate.getTime() + cacheData.expiration <
      new Date().getTime()
    ) {
      responseCache.delete(key);
      return null;
    }

    return cacheData.data;
  }

  function hasKey(key: string) {
    return responseCache.has(key);
  }

  return (
    <context.Provider
      value={{
        headers,
        clearCache: () => {
          responseCache.clear();
        },
        setCache,
        getCache,
        hasKey,
      }}
    >
      {children}
    </context.Provider>
  );
};
