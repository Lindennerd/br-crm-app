import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "react-query";
import { Client, ClientNew, GetClientsRequest } from "../types/app.types";
import { useApi } from "./useApi";
import { useMapUtils } from "./useMapUtils";
export const useClientApi = () => {
  const { post } = useApi();
  const { objectToMap, mapToObject } = useMapUtils();
  return {
    getClientsByType: async (request: GetClientsRequest): Promise<Client[]> => {
      //if (request.clientType === "") return [];
      const clients = await post<GetClientsRequest, Client[]>(
        "/Client/GetClients",
        {
          ...request,
          //fieldsFilter: mapToObject(request.fieldsFilter),
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
      return await post("/Client/RemoveClient/" + clientId, true);
    },
    saveClient: async (client: Client): Promise<{ clientId: string }> => {
      return await post(
        "/Client/UpsertClient",
        {
          id: client.id,
          clientType: client.clientType,
          fieldValues: mapToObject(client.fieldValues),
        },
        true
      );
    },
  };
};

export const useSaveClient = () => {
  const { post } = useApi();
  const queryClient = useQueryClient();

  return useMutation(
    ["saveClient"],
    async (client: ClientNew) => {
      return await post<Partial<ClientNew>, { clientId: string }>(
        "/Client/UpsertClient",
        {
          id: client.id,
          clientTypeId: client.clientTypeId,
          fieldValues: client.fieldValues,
        }
      );
    },
    {
      onSuccess: (result: { clientId: string }, variables) => {
        queryClient.invalidateQueries("getClientsByType");
        queryClient.setQueryData<ClientNew[]>("getClientsByType", (old) => {
          if (!old) return [{ ...variables, id: result.clientId }];
          return [
            ...old.filter((c) => c.id !== result.clientId),
            { ...variables, id: result.clientId },
          ];
        });
      },
    }
  );
};

export const useRemoveClient = () => {
  const { post } = useApi();
  const queryClient = useQueryClient();

  return useMutation(
    ["removeClient"],
    async (clientId: string) => {
      return await post("/Client/RemoveClient/" + clientId, null);
    },
    {
      onSuccess: (result, variables) => {
        queryClient.invalidateQueries("getClientsByType");
        queryClient.setQueryData<ClientNew[]>("getClientsByType", (old) => {
          if (!old) return [];
          return old.filter((c) => c.id !== variables);
        });
      },
    }
  );
};


export const useGetClientsByTypeInfinite = (request: Partial<GetClientsRequest>) => {
  const { post } = useApi();

  return useInfiniteQuery(
    ["getClientsByType", request],
    async ({ pageParam = request.pageSize ?? 10}) => {
      return await post<Partial<GetClientsRequest>, ClientNew[]>(
        "/Client/GetClients",
        {
          ...request,
          pageSize: pageParam,
        }
      );
    },
  );
}
