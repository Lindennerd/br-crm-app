import { createContext, useContext } from "react";
import { AppPage } from "../types/app.types";
import { appPages } from "../types/pages";
import { childrenProp as ChildrenProp } from "../types/react.types";

interface IMenuContext {
  modules: AppPage[];
}

const context = createContext<IMenuContext>({
  modules: appPages,
});
export const useMenuContext = () => useContext(context);

export const MenuContextProvider = ({ children }: ChildrenProp) => {
  return (
    <context.Provider value={{ modules: appPages }}>
      {children}
    </context.Provider>
  );
};
