import { useIonToast } from "@ionic/react";
import { useMutation } from "react-query";
import { useAuthContext } from "../context/AuthContext";
import { Profile } from "../types";
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
        updateUser({ ...user!, Profile: variables });
        presentToast({
          message: "Perfil atualizado com sucesso",
          duration: 3000,
          color: "success",
          position: "top",
        });
      },
    }
  );
};
