import {
  Process,
  ProcessConfiguration,
  ProcessFilter,
} from "../types/app.types";
import { useApi } from "./useApi";

export const useProcessApi = () => {
  const { post, get } = useApi();
  return {
    create: async (
      process: Pick<
        Process,
        "title" | "description" | "sla" | "executor" | "additionalData"
      > & { client: string }
    ): Promise<Process> => {
      return await post("/Process/CreateProcess", {
        ...process,
        additionalData: Object.fromEntries(process.additionalData),
      });
    },

    filter: async (filter: Partial<ProcessFilter>): Promise<Process[]> => {
      var params = encodeURIComponent(JSON.stringify(filter));
      return await get(`/Process/FilterProcesses?${params}`);
    },

    getOne: async (id: string): Promise<Process> => {
      return await get(`/Process/GetProcess/${id}`);
    },

    getMany: async (page: number, pageSize: number): Promise<Process[]> => {
      return await get(
        `/Process/FilterProcesses?page=${page}&pageSize=${pageSize}`
      );
    },
  };
};
