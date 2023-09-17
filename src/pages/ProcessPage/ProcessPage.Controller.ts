import { atom, useAtom } from "jotai";
import {
  Client,
  Process,
  ProcessConfiguration,
  ProcessStatus,
} from "../../types/app.types";
import { useProcessApi } from "../../api/useProcessApi";
import { useIonToast } from "@ionic/react";
import { useConfigurationApi } from "../../api/useConfigurationApi";

export const processAtom = atom<Process[]>([]);

export const useProcessPageController = () => {
  const [presentToast] = useIonToast();

  const [processes, setProcesses] = useAtom(processAtom);
  const { getProcessConfiguration } = useConfigurationApi();
  const { getMany, create, filter } = useProcessApi();

  function errorToast(message: string) {
    presentToast({
      message: message,
      duration: 2000,
      color: "danger",
    });
  }

  return {
    getStatusDescription: (status: ProcessStatus) => {
      switch (status) {
        case ProcessStatus.Blocked:
          return "Bloqueado";
        case ProcessStatus.Done:
          return "Finalizado";
        case ProcessStatus.InProgress:
          return "Em andamento";
        case ProcessStatus.Waiting:
          return "Aguardando";
        default:
          return "";
      }
    },

    getConfigurations: async (): Promise<ProcessConfiguration[]> => {
      return await getProcessConfiguration();
    },

    load: async (client: Client | null) => {
      try {
        var result = (client 
            ? await filter({ clientId: client?.id, page: 1, pageSize: 1000 })
            : await getMany(1, 1000));
        setProcesses(result);
      } catch (error) {
        console.error(error);
        errorToast((error as Error).message);
      }
    },

    search: async (searchText: string | null | undefined) => {
      try {
        var result = searchText
          ? await filter({
              title: searchText,
              page: 1,
              pageSize: 1000,
              clientName: searchText,
            })
          : await getMany(1, 1000);

        setProcesses(result);
      } catch (error) {
        console.error(error);
        errorToast((error as Error).message);
      }
    },

    add: async (process: Process) => {
      try {
        const createdProcess = await create({ ...process, clientId: process.clientId });
        setProcesses((state) => [...state, createdProcess]);
      } catch (error) {
        console.error(error);
        errorToast((error as Error).message);
      }
    },
    filter: async (filter: string) => {},
  };
};
