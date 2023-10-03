import { useIonToast } from "@ionic/react";
import { useMutation } from "react-query";
import { useRouter } from "../common/useRouter";
import { useAuthContext } from "../context/AuthContext";
import { Auth } from "../types";
import { useApi } from "./useApi";

export type loginData = {
  user: string;
  password: string;
};

export const useLogin = () => {
  const { post } = useApi();
  const { login } = useAuthContext();
  const [presentToast] = useIonToast();
  const { gotoHome } = useRouter();

  return useMutation(
    ["login"],
    async (loginData: loginData): Promise<Auth> => {
      return await post<loginData, Auth>("security/login", loginData, true);
    },
    {
      onSuccess: (data) => {
        if (!data || !data.user) {
          presentToast({
            message: "Usuário ou senha inválidos",
            duration: 3000,
            color: "danger",
            position: "top",
          });
          return;
        } else {
          login(data);
          gotoHome();
        }
      },
    }
  );
};

export const useChangePassword = () => {
  const { post } = useApi();

  return useMutation(
    ["changePassword"],
    async (data: {
      oldPassword: string;
      newPassword: string;
      newPasswordConfirmation: string;
    }) => {
      return await post("security/changePassword", data);
    }
  );
};
