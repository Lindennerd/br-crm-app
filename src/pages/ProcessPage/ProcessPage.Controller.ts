import { atom, useAtom } from "jotai";
import { Process, ProcessConfiguration } from "../../types/app.types";
import { useProcessApi } from "../../api/useProcessApi";
import { useIonToast } from "@ionic/react";
import { useConfigurationApi } from "../../api/useConfigurationApi";
import { changeProcessAtom } from "../../components/Process/ChangeProcessModal";

export const processAtom = atom<{ processes: Process[]; loading: boolean }>({
  processes: [],
  loading: true,
});

export const useProcessPageController = () => {
  const [presentToast] = useIonToast();

  const [processes, setProcesses] = useAtom(processAtom);
  const { getProcessConfiguration } = useConfigurationApi();
  const { getAllProcesses, create } = useProcessApi();

  function errorToast(message: string) {
    presentToast({
      message: message,
      duration: 2000,
      color: "danger",
    });
  }

  return {
    getConfigurations: async (): Promise<ProcessConfiguration[]> => {
        return await getProcessConfiguration();
    },

    load: async () => {
      try {
        var result = await getAllProcesses(1, 1000);
        setProcesses((state) => ({
          ...state,
          processes: result,
          loading: false,
        }));
      } catch (error) {
        errorToast((error as Error).message);
      }
    },

    search: async (searchText: string | null | undefined) => {
      try {
        if (!searchText) return;
        var result = await getAllProcesses(1, 1000);
        setProcesses((state) => ({
          ...state,
          processes: result.filter((x) =>
            x.title.toLowerCase().includes(searchText.toLowerCase())
          ),
          loading: false,
        }));
      } catch (error) {
        errorToast((error as Error).message);
      }
    },
    
    add: async (process: Process) => {
        try {
            await create(process);
            setProcesses((state) => ({
            ...state,
            processes: [...state.processes, process],
            }));
        } catch (error) {
            errorToast((error as Error).message);
        }
    },
    filter: async (filter: string) => {}
  };
};
