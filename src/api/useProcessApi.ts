import {
  Process,
  ProcessComment,
  ProcessConfiguration,
  ProcessEvent,
  ProcessFilter,
  ProcessTask,
} from "../types/app.types";
import { useApi } from "./useApi";

export const useProcessApi = () => {
  const { post, get } = useApi();
  return {
    create: async (
      process: Pick<
        Process,
        "title" | "description" | "sla" | "executor" | "additionalData"
      > & { clientId: string }
    ): Promise<Process> => {
      return await post("/Process/CreateProcess", {
        ...process,
        additionalData:
          process.additionalData.size > 0
            ? Object.fromEntries(process.additionalData)
            : {},
      });
    },

    filter: async (filter: Partial<ProcessFilter>): Promise<Process[]> => {
      var params = new URLSearchParams(filter as any);
      return await get(`/Process/FilterProcesses?${params.toString()}`);
    },

    getOne: async (id: string): Promise<Process> => {
      return await get(`/Process/GetProcess/${id}`);
    },

    getMany: async (page: number, pageSize: number): Promise<Process[]> => {
      return await get(
        `/Process/FilterProcesses?page=${page}&pageSize=${pageSize}`
      );
    },

    update: async (process: Process): Promise<Process> => {
      return await post("/Process/UpdateProcess", {
        ...process,
        additionalData:
          process.additionalData.size > 0
            ? Object.fromEntries(process.additionalData)
            : {},
      });
    },

    addEvent(processId: string, event: ProcessEvent): Promise<Process> {
      return post(`Process/AddEvent/${processId}`, event);
    },

    upsertComment(
      processId: string,
      comment: ProcessComment
    ): Promise<Process> {
      if (comment.id)
        return post(`Process/UpdateComment/${processId}`, comment);
      return post(`Process/AddComment/${processId}`, {
        comment: comment.comment,
      });
    },

    deleteComment(processId: string, commentId: string): Promise<Process> {
      return post(`Process/RemoveComment/${processId}`, {
        commentId: commentId,
      });
    },

    completeTask(processId: string, task: ProcessTask): Promise<ProcessTask> {
      return post(`Process/CompleteTask/${processId}`, task);
    },

    uncompleteTask(processId: string, task: ProcessTask): Promise<ProcessTask> {
      return post(`Process/UncompleteTask/${processId}`, task);
    }
  };
};
