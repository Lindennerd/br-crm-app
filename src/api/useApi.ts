import { CapacitorHttp as http } from "@capacitor/core";
import { useIonRouter } from "@ionic/react";
import { get as getStored, remove } from "../common/storage";
import { useResponseCacheContext } from "../context/CacheContext";
import { UserData } from "../types/app.types";

export const useApi = () => {
  const { push } = useIonRouter();

  const baseUrl: string = "https://brcrm-api.fly.dev";
  const { headers, responseCache, clearCache } = useResponseCacheContext();

  async function authenticate() {
    const authData: UserData = await getStored("authInfo");
    if (authData)
      headers.set("Authorization", authData ? `Bearer ${authData.token}` : "");
    else {
      remove("authInfo");
      push("pages/login", "forward", "replace");
    }
  }

  async function get<TResponse>(url: string): Promise<TResponse> {
    await authenticate();
    if (responseCache.has(url)) return responseCache.get(url);

    const response = await http.get({
      url: new URL(url, baseUrl).toString(),
      headers: Object.fromEntries(headers),
    });

    if (response.status === 401) {
      remove("authInfo");
      push("/login", "forward", "replace");
    }

    if (response.status > 299 && response.status !== 401)
      throw new Error(response.data);

    if (!responseCache.has(url)) responseCache.set(url, response.data);

    return response.data;
  }

  async function post<TData, TResponse>(
    url: string,
    data: TData,
    shouldClearCache: boolean = false
  ): Promise<TResponse> {
    await authenticate();

    if (shouldClearCache) clearCache();
    if (responseCache.has(JSON.stringify({ url, data })))
      responseCache.get(JSON.stringify({ url, data }));

    const response = await http.post({
      url: new URL(url, baseUrl).toString(),
      data,
      headers: Object.fromEntries(headers),
    });

    if (response.status === 401) {
      remove("authInfo");
      push("/login", "forward", "replace");
    }

    if (response.status > 299 && response.status !== 401)
      throw new Error(response.data);

    if (!responseCache.has(JSON.stringify({ url, data })))
      responseCache.set(JSON.stringify({ url, data }), response.data);

    return response.data;
  }

  return {
    get,
    post,
    baseUrl,
    headers,
  };
};
