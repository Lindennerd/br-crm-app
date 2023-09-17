import { createContext, useContext, useState } from "react";

interface ILoadingContext {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const context = createContext<ILoadingContext>({
  loading: false,
  setLoading: () => {},
});
export const useLoadingContext = () => useContext(context);

export const LoadingContextProvider = ({ children }: any) => {
    const [loading, setLoading] = useState<boolean>(false);
  return (
    <context.Provider value={{ loading, setLoading }}>{children}</context.Provider>
  );
};
