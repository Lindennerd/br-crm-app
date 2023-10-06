import { useMutation, useQuery, useQueryClient } from "react-query";
import { Notification } from "../types";
import { useApi } from "./useApi";

export const useGetNotifications = () => {
  const { get } = useApi();

  return useQuery(
    "notifications",
    () =>
      get<Notification[]>(
        `Notification/GetNotificationsForUser?page=1&pageSize=100000`
      ),
    {
      staleTime: 0,
      refetchInterval: 1000 * 60,
    }
  );
};

export const markNotificationAsRead = (id: string) => {
  const { post } = useApi();
  const queryClient = useQueryClient();

  return useMutation(
    ["markNotificationAsRead", id],
    async () => {
      await post(`notification/MarkNotificationAsRead/${id}`, {});
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("notifications");
      },
    }
  );
};
