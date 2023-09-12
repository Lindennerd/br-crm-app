import { CapacitorHttp as http } from "@capacitor/core";
import { useApi } from "./useApi";

export const useSecurity = () => {
  const { baseUrl, headers } = useApi();

  async function login(user: string, password: string) {
    const data = { user, password };
    const response = await http.post({
      url: new URL('security/login', baseUrl).toString(),
      data,
      headers: Object.fromEntries(headers),
    });

    if (!response.data || response.status > 299) return null;
    else return response.data;
  }

  return {
    login,
    logout: () => {},
  };
};
