import { Client, GetClientsRequest } from "../types/app.types";
import { useApi } from "./useApi";
export const useClientApi = () => {
  const { post } = useApi();
  return {
    getClientsByType: async (request: GetClientsRequest): Promise<Client[]> => {
      if (request.clientType === "") return [];
      return await post("/Client/GetClients", {
        ...request,
        fieldsFilter: Object.fromEntries(request.fieldsFilter ?? []),
      });
    },
    removeClient: async (clientId: string) => {
      return await post("/Client/RemoveClient", clientId, true);
    },
    saveClient: async (client: Client): Promise<{ clientId: string }> => {
      return await post("/Client/UpsertClient", client, true);
    },
  };
};
