import { useIonToast } from "@ionic/react";
import { useMutation, useQuery } from "react-query";
import { useAuthContext } from "../context/AuthContext";
import { Profile, User } from "../types";
import { GetUsers } from "../types/app.types";
import { useApi } from "./useApi";

export const useUpdateProfile = () => {
  const { post } = useApi();
  const { user, updateUser } = useAuthContext();
  const [presentToast] = useIonToast();

  return useMutation(
    ["updateProfile"],
    async (data: Profile) => {
      return await post("user/updateProfile", data);
    },
    {
      onSuccess: (data, variables) => {
        updateUser({ ...user!, profile: variables });
      },
    }
  );
};

export const useGetUsers = (params: GetUsers) => {
  const { get } = useApi();
  return useQuery(["getUsers"], async () => {
    var url = `user/getUserForOrganization?organization=${params.organization}&page=${params.page}&size=${params.pageSize}`;
    console.log("url get users", url);
    return await get<User[]>(url);
  });
};
