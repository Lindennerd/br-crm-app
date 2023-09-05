import { createContext, useContext } from "react";
import { AppPage } from "../types/app.types";
import { modulePages } from "../types/pages";
import { childrenProp as ChildrenProp } from "../types/react.types";

interface IMenuContext {
  modules: AppPage[];
}

const context = createContext<IMenuContext>({
  modules: modulePages,
});
export const useMenuContext = () => useContext(context);

export const MenuContextProvider = ({ children }: ChildrenProp) => {
  return (
    <context.Provider value={{ modules: modulePages }}>
      {children}
    </context.Provider>
  );
};
