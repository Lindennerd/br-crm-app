import { createContext, useContext, useState } from "react";
import { Client } from "../types/app.types";

export type CurrentClientContextType = {
  client: Client | null;
  setClient: (client: Client | null) => void;
};

const initial: CurrentClientContextType = {
  client: null,
  setClient: () => {},
};

const context = createContext<CurrentClientContextType>(initial);
export const useCurrentClientContext = () => useContext(context);

export const CurrentClientContextProvider = ({
  children,
}: {
  children: any;
}) => {
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const handleSetCurrentClient = (client: Client | null) => {
    setCurrentClient(client);
  };

  return (
    <context.Provider
      value={{
        client: currentClient,
        setClient: handleSetCurrentClient,
      }}
    >
      {children}
    </context.Provider>
  );
};
