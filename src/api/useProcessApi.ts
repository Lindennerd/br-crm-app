import { Process, ProcessConfiguration, ProcessFilter } from "../types/app.types";
import { useApi } from "./useApi";

export const useProcessApi = () => {
  const { post, get } = useApi();
  return {
    create: async (
      process: Pick<
        Process,
        | "title"
        | "description"
        | "client"
        | "SLA"
        | "executor"
        | "additionalData"
      >
    ): Promise<Process> => {
      return await post("/Process/CreateProcess", {
        ...process,
        additionalData: Object.fromEntries(process.additionalData),
      });
    },

    getProcesses: async (filter: ProcessFilter): Promise<Process[]> => {
        var params = encodeURIComponent(JSON.stringify(filter));
        return await get(`/Process/GetProcesses?${params}`);
    },

    getProcess: async (id: string): Promise<Process> => {
        return await get(`/Process/GetProcess/${id}`);
    },

    getAllProcesses: async (page: number, pageSize: number): Promise<Process[]> => {
        return await get(`/Process/FilterProcesses?page=${page}&pageSize=${pageSize}`);
    },
  };
};
