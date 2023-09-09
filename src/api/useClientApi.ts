import { Client, GetClientsRequest } from "../types/app.types";
import { useApi } from "./useApi";
export const useClientApi = () => {
  const { post } = useApi();
  return {
    getClientsByType: async (request: GetClientsRequest) => {
      if (request.clientType === "") return [];
      return await post("/Client/GetClients", request);
    },
    removeClient: async (clientId: string) => {
      return await post("/Client/RemoveClient", clientId, true);
    },
    saveClient: async (client: Client) => {
      return await post("/Client/UpsertClient", client, true);
    },
  };
};
