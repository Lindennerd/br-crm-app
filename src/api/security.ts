import { CapacitorHttp as http } from "@capacitor/core";
import { get } from "../common/storage";

export const useApi = () => {
  const baseUrl: string = "http://localhost:5114";
  const headers = {
    "Content-Type": "application/json",
    Authorization: "",
  };

  async function authenticate() {
    const authData = await get("authInfo");
    if (authData) headers.Authorization = `Bearer ${authData.token}`;
  }

  async function login(user: string, password: string) {
    const data = { user, password };
    const response = await await http.post({
      url: `${baseUrl}/security/login`,
      data,
      headers,
    });

    if (!response.data || response.status > 299) return null;
    else return response.data;
  }

  return { login, logout: () => {} };
};
