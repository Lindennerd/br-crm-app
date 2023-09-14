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
    saveConfiguration: async (config: ClientConfiguration) => {
      return await post("/organization/configureclients", config, true);
    },
  };
};
