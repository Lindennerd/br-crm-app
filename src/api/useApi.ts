import { CapacitorHttp as http } from "@capacitor/core";
import { useIonRouter } from "@ionic/react";
import { get as getStored, remove, set } from "../common/storage";
import { useResponseCacheContext } from "../context/CacheContext";
import { Auth } from "../types";
import { BussinessError } from "../types/app.types";

export const useApi = () => {
  const baseUrl: string = import.meta.env.DEV
    ? "https://localhost:7156/"
    : "https://brcrm-api.fly.dev";

  const { push } = useIonRouter();

  const { headers } = useResponseCacheContext();

  async function authenticate() {
    const authData: Auth = await getStored("authInfo");
    if (authData)
      headers.set("Authorization", authData ? `Bearer ${authData.token}` : "");
    else {
      remove("authInfo");
      push("page/login", "forward", "replace");
    }
  }

  async function refreshToken() {
    const { refreshToken, user } = (await getStored("authInfo")) as Auth;
    if (!refreshToken) {
      throw new Error("No refresh token found");
    }
    const response = await http.post({
      url: new URL("security/refreshToken", baseUrl).toString(),
      data: { refreshToken, user: user.id },
      headers: Object.fromEntries(headers),
    });

    if (response.status === 401)
      throw new Error("Refresh token is expired or invalid");
    else {
      const authData: Auth = response.data;
      set("authInfo", authData);
      headers.set("Authorization", authData ? `Bearer ${authData.token}` : "");
    }
  }

  async function get<TResponse>(url: string): Promise<TResponse> {
    try {
      await authenticate();
      const response = await http.get({
        url: new URL(url, baseUrl).toString(),
        headers: Object.fromEntries(headers),
      });
      if (response.status === 401) {
        await refreshToken();
        return get(url);
      }
      if (response.status > 299)
        throw JSON.parse(response.data) as BussinessError;
      return response.data;
    } catch (Error) {
      push("/page/login", "root", "replace");
      return {} as TResponse;
    }
  }

  async function post<TData, TResponse>(
    url: string,
    data: TData,
    isLogin: boolean = false
  ): Promise<TResponse> {
    try {
      if (!isLogin) await authenticate();

      const response = await http.post({
        url: new URL(url, baseUrl).toString(),
        data,
        headers: Object.fromEntries(headers),
      });

      if (response.status === 401 && !isLogin) {
        await refreshToken();
        return post(url, data);
      }
      if (response.status > 299)
        throw JSON.parse(response.data) as BussinessError;
      return response.data;
    } catch (Error) {
      push("/page/login", "root", "replace");
      return {} as TResponse;
    }
  }

  return {
    get,
    post,
    baseUrl,
    headers,
  };
};
