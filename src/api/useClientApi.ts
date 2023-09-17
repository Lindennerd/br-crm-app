import { Client, GetClientsRequest } from "../types/app.types";
import { useApi } from "./useApi";
import { useMapUtils } from "./useMapUtils";
export const useClientApi = () => {
  const { post } = useApi();
  const {  objectToMap, mapToObject } = useMapUtils();
  return {
    getClientsByType: async (request: GetClientsRequest): Promise<Client[]> => {
      if (request.clientType === "") return [];
      const clients = await post<GetClientsRequest, Client[]>(
        "/Client/GetClients",
        {
          ...request,
          fieldsFilter: mapToObject(request.fieldsFilter),
        }
      );

      return clients.map((client) => {
        return {
          ...client,
          fieldValues: objectToMap(client.fieldValues) as Map<string, string>,
        };
      });
    },
    removeClient: async (clientId: string) => {
      return await post("/Client/RemoveClient/"+ clientId, true);
    },
    saveClient: async (client: Client): Promise<{ clientId: string }> => {
      return await post("/Client/UpsertClient", {
        id: client.id,
        clientType: client.clientType,
        fieldValues: mapToObject(client.fieldValues),
      }, true);
    },
  };
};
