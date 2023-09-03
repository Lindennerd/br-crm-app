import { CapacitorHttp as http } from "@capacitor/core";
import { get } from "../common/storage";
import { ClientConfiguration } from "../types/app.types";

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
    const response = await http.post({
      url: `${baseUrl}/security/login`,
      data,
      headers,
    });

    if (!response.data || response.status > 299) return null;
    else return response.data;
  }

  async function getConfiguration() {
    await authenticate();
    const response = await http.get({
      url: `${baseUrl}/organization/getclientconfiguration`,
      headers,
    });

    if (!response.data || response.status > 299) throw new Error(response.data);
    else return response.data;
  }

  async function saveConfiguration(config: ClientConfiguration) {
    await authenticate();
    const response = await http.post({
      url: `${baseUrl}/organization/configureclients`,
      data: config,
      headers,
    });
    if (response.status > 299) throw new Error(response.data);
    else return response.data;
  }

  return { login, getConfiguration, saveConfiguration, logout: () => {} };
};
