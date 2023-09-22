import { CapacitorHttp as http } from "@capacitor/core";
import { useIonRouter } from "@ionic/react";
import { get as getStored, remove } from "../common/storage";
import { useResponseCacheContext } from "../context/CacheContext";
import { BussinessError, UserData } from "../types/app.types";

export const useApi = () => {
  const baseUrl: string = import.meta.env.DEV
    ? "http://localhost:5114"
    : "https://brcrm-api.fly.dev";

  const { push } = useIonRouter();

  const { headers } = useResponseCacheContext();

  async function authenticate() {
    const authData: UserData = await getStored("authInfo");
    if (authData)
      headers.set("Authorization", authData ? `Bearer ${authData.token}` : "");
    else {
      remove("authInfo");
      push("page/login", "root", "replace");
    }
  }

  async function get<TResponse>(url: string): Promise<TResponse> {
    await authenticate();

    const response = await http.get({
      url: new URL(url, baseUrl).toString(),
      headers: Object.fromEntries(headers),
    });

    if (response.status > 299) throw JSON.parse(response.data) as BussinessError;
    return response.data;
  }

  async function post<TData, TResponse>(
    url: string,
    data: TData,
    isLogin: boolean = false
  ): Promise<TResponse> {
    if(!isLogin) await authenticate();

    const response = await http.post({
      url: new URL(url, baseUrl).toString(),
      data,
      headers: Object.fromEntries(headers),
    });

    if (response.status > 299) throw JSON.parse(response.data) as BussinessError;
    return response.data;
  }

  return {
    get,
    post,
    baseUrl,
    headers,
  };
};
