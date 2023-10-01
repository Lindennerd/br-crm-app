import { useMutation } from "react-query";
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

  return useMutation(
    ["login"],
    async (loginData: loginData): Promise<Auth> => {
      return await post<loginData, Auth>("security/login", loginData, true);
    },
    { onSuccess: (data) => login(data) }
  );
};
