import { ClientConfiguration } from "../types/app.types";
import { useApi } from "./useApi";

export const useConfigurationApi = () => {
  const { get, post } = useApi();

  return {
    getConfiguration: async (): Promise<ClientConfiguration[]> => {
      return await get("/organization/getclientconfiguration");
    },

    saveConfiguration: async (config: ClientConfiguration) => {
      return await post("/organization/configureclients", config, true);
    },
  };
};
