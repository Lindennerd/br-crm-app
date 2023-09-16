import { atom, useAtom } from "jotai";
import {
  ProcessConfiguration,
  ClientConfiguration,
  Client,
} from "../../../types/app.types";
import { changeProcessAtom } from "../ChangeProcessModal";

const initialState: IProcessBindingsFormState = {
  processConfigurations: [],
  clientConfigurations: [],
  selectedProcessConfiguration: null,
  search: {
    field: "",
    searching: false,
  },
  selectedClientType: null,
  selectedClient: null,
  clientSearchResult: [],
};

interface IProcessBindingsFormState {
  processConfigurations: ProcessConfiguration[];
  clientConfigurations: ClientConfiguration[];
  selectedProcessConfiguration?: ProcessConfiguration | null;
  search: {
    field: string;
    searching: boolean;
  };
  selectedClientType?: ClientConfiguration | null | undefined;
  selectedClient?: Client | null | undefined;
  clientSearchResult: Client[];
}

export const processBindingFormsState = atom<IProcessBindingsFormState>(initialState);

export const useProcessBindingFormController = () => {
  const [state, setState] = useAtom(processBindingFormsState);

  return {
    state,
    loadConfigurations: async (
      processConfigurations: ProcessConfiguration[],
      clientConfigurations: ClientConfiguration[]
    ) => {
      setState((prev) => {
        return {
          ...prev,
          processConfigurations: processConfigurations,
          clientConfigurations: clientConfigurations,
        };
      });
    },

    loadingSearch: (searching: boolean) => {
      setState((prev) => {
        return {
          ...prev,
          search: {
            ...prev.search,
            searching: searching,
          },
        };
      });
    },
    setSearchResult: (clients: Client[]) => {
      setState((prev) => {
        return {
          ...prev,
          clientSearchResult: clients,
        };
      });
    },

    setSearchField: (field: string) => {
      setState((prev) => {
        return {
          ...prev,
          search: {
            ...prev.search,
            field: field,
          },
        };
      });
    },

    setSelectedProcessConfiguration: (id: string | undefined | null) => {
      if (!id) return;
      const configuration = state.processConfigurations.find(
        (c) => c.id === id
      );

      setState((prev) => {
        return {
          ...prev,
          selectedProcessConfiguration: configuration,
        };
      });
    },

    setSelectedClientType: (configuration: ClientConfiguration | null) => {
      if (!configuration) return;
      setState((prev) => {
        return {
          ...prev,
          selectedClientType: configuration,
        };
      });
    },

    searchBarDisabled: (): boolean => {
      return (
        state.search.searching ||
        (!state.search.field && state.search.field !== "") ||
        !state.selectedClientType
      );
    },
    setSelectedClient: (client: Client) => {
      setState((prev) => {
        return {
          ...prev,
          selectedClient: client,
        };
      });
    },
  };
};
