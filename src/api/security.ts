import { useApi } from "./useApi";
import { useMutation } from "react-query";
import { UserData } from "../types/app.types";
import { useAuthContext } from "../context/AuthContext";

export type loginData = {
  user: string;
  password: string;
};

export const useLogin = () => {
  const { post } = useApi();
  const { login } = useAuthContext();


  return useMutation(
    ["login"],
    async (loginData: loginData): Promise<UserData> => {
      return await post<loginData, UserData>("security/login", loginData, true);
    },
    { onSuccess: (data) => login(data) }
  );
};