import { useIonRouter } from "@ionic/react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createStore, get, remove, set } from "../common/storage";
import { Auth, User } from "../types";
import { childrenProp } from "../types/react.types";

interface IAuthContext {
  login: (auth: Auth) => void;
  logout: () => void;
  user: User | undefined;
}

const contextValue: IAuthContext = {
  login: async (auth: Auth) => {},
  logout: () => {},
  user: {} as User,
};

const context = createContext<IAuthContext>(contextValue);

export const useAuthContext = () => useContext(context);

export const AuthContextProvider = ({ children }: childrenProp) => {
  createStore("authStore");
  const { push } = useIonRouter();

  const [auth, setAuth] = useState<User>();

  const memoizedAuth = useMemo(() => {
    return auth;
  }, [auth]);

  useEffect(() => {
    const fetchCachedData = async () => {
      const data = (await get("authInfo")) as Auth;
      setAuth(data.user);
    };

    fetchCachedData().catch((err) => console.error(err));
  }, []);

  const handleLogin = async (auth: Auth) => {
    debugger;
    set("authInfo", auth);
    setAuth(auth.user);
  };

  const handleLogout = async () => {
    await remove("authInfo");
    setAuth(undefined);
    push("page/login", "forward", "replace");
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
