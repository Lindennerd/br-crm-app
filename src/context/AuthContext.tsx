import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useSecurity } from "../api/security";
import { createStore, get, remove, set } from "../common/storage";
import { UserData } from "../types/app.types";
import { childrenProp } from "../types/react.types";

interface IAuthContext {
  login: (user: string, password: string) => Promise<{ success: boolean }>;
  logout: () => void;
  user: UserData | undefined;
}

const contextValue: IAuthContext = {
  login: async (user: string, password: string) => {
    return new Promise((res, rej) => {});
  },
  logout: () => {},
  user: {
    modules: [],
    name: "",
    token: "",
    user: {
      name: "",
      userName: "",
      userRole: UserRole.User,
    },
  },
};

const context = createContext<IAuthContext>(contextValue);

export const useAuthContext = () => useContext(context);

export const AuthContextProvider = ({ children }: childrenProp) => {
  createStore("authStore");
  const { login, logout } = useSecurity();

  const [auth, setAuth] = useState<UserData>();

  const memoizedAuth = useMemo(() => {
    return auth;
  }, [auth]);

  useEffect(() => {
    const fetchCachedData = async () => {
      const data = await get("authInfo");
      setAuth(data);
    };

    fetchCachedData().catch((err) => console.error(err));
  }, []);

  const handleLogin = async (user: string, password: string) => {
    const response: UserData = await login(user, password);
    if (!response) return { success: false };

    set("authInfo", response);
    setAuth(response);
    return { success: true };
  };

  const handleLogout = async () => {
    await remove("authInfo");
    setAuth(undefined);
    logout();
  };

  return (
    <context.Provider
      value={{
        ...contextValue,
        login: handleLogin,
        user: memoizedAuth,
        logout: handleLogout,
      }}
    >
      {children}
    </context.Provider>
  );
};
