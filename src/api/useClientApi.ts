import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { Client, GetClientsRequest } from "../types/app.types";
import { useApi } from "./useApi";

export const useSaveClient = () => {
  const { post } = useApi();
  const queryClient = useQueryClient();

  return useMutation(
    ["saveClient"],
    async (client: Client) => {
      return await post<Partial<Client>, { clientId: string }>(
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
        queryClient.setQueryData<Client[]>("getClientsByType", (old) => {
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
        queryClient.setQueryData<Client[]>("getClientsByType", (old) => {
          if (!old) return [];
          return old.filter((c) => c.id !== variables);
        });
      },
    }
  );
};

export const useGetClientsByTypeInfinite = (
  request: Partial<GetClientsRequest>
) => {
  const { post } = useApi();

  return useInfiniteQuery(
    ["getClientsByType", request],
    async ({ pageParam = request.pageSize ?? 10 }) => {
      return await post<Partial<GetClientsRequest>, Client[]>(
        "/Client/GetClients",
        {
          ...request,
          pageSize: pageParam,
        }
      );
    }
  );
};

export const useGetClientsByType = (
  request: Partial<GetClientsRequest>,
  enabled: boolean = true
) => {
  const { post } = useApi();

  return useQuery(
    ["getClientsByType", request],
    async ({ pageParam = request?.pageSize ?? 10 }) => {
      return await post<Partial<GetClientsRequest>, Client[]>(
        "/Client/GetClients",
        {
          ...request,
          pageSize: pageParam,
        }
      );
    },
    { enabled }
  );
};
