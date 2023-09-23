import { useQuery } from "react-query";
import { ClientConfiguration, ProcessConfiguration } from "../types/app.types";
import { useApi } from "./useApi";

export const useConfigurationApi = () => {
  const { get, post } = useApi();

  return {
    getClientConfiguration: async (): Promise<ClientConfiguration[]> => {
      return await get("/organization/getclientconfiguration");
    },
    getProcessConfiguration: async (): Promise<ProcessConfiguration[]> => {
      return await get(`/Organization/GetProcessConfiguration`);
  },
    saveConfiguration: async (config: ClientConfiguration) : Promise<{clientConfigurationId: string}> => {
      return await post("/organization/configureclients", config, true);
    },
  };
};


export const useGetClientConfiguration = () => {
  const { get } = useApi();
  return useQuery("getClientConfiguration", async () => {
    return await get<ClientConfiguration[]>("/organization/getclientconfiguration");
  });
}