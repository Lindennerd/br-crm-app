import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createStore, get, remove, set } from "../common/storage";
import { UserData } from "../types/app.types";
import { childrenProp } from "../types/react.types";

interface IAuthContext {
  login: (user: UserData) => void;
  logout: () => void;
  user: UserData | undefined;
}

const contextValue: IAuthContext = {
  login: async (user: UserData) => {},
  logout: () => {},
  user: {} as UserData,
};

const context = createContext<IAuthContext>(contextValue);

export const useAuthContext = () => useContext(context);

export const AuthContextProvider = ({ children }: childrenProp) => {
  createStore("authStore");

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

  const handleLogin = async (user: UserData) => {   
    set("authInfo", user);
    setAuth(user);
  };

  const handleLogout = async () => {
    await remove("authInfo");
    setAuth(undefined);
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
