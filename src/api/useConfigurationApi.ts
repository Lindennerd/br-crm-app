import { useMutation, useQuery, useQueryClient } from "react-query";
import { ClientConfiguration, ProcessConfiguration } from "../types/app.types";
import { useApi } from "./useApi";

export const useGetProcessConfigurations = () => {
  const { get } = useApi();
  return useQuery("getProcessConfigurations", async () => {
    return await get<ProcessConfiguration[]>(`/Organization/GetProcessConfiguration`);
  });
}

export const useGetClientConfiguration = () => {
  const { get } = useApi();
  return useQuery("getClientConfiguration", async () => {
    return await get<ClientConfiguration[]>(
      "/organization/getclientconfiguration"
    );
  });
};

export const useSaveConfguration = () => {
  const { post } = useApi();
  const queryClient = useQueryClient();
  return useMutation(
    ["saveConfiguration"],
    async (config: ClientConfiguration) => {
      return await post<ClientConfiguration, { clientConfigurationId: string }>(
        "/organization/configureclients",
        config
      );
    },
    {
      onSuccess: (result, variables) => {
        queryClient.invalidateQueries("getClientConfiguration");
        queryClient.setQueryData<ClientConfiguration[]>(
          "getClientConfiguration",
          (old) => {
            if (!old)
              return [{ ...variables, id: result.clientConfigurationId }];
            return [
              ...old.filter((c) => c.id !== result.clientConfigurationId),
              { ...variables, id: result.clientConfigurationId },
            ];
          }
        );
      },
    }
  );
};
