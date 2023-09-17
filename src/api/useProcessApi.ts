import {
  Process,
  ProcessComment,
  ProcessConfiguration,
  ProcessEvent,
  ProcessFilter,
  ProcessTask,
} from "../types/app.types";
import { useApi } from "./useApi";
import { useMapUtils } from "./useMapUtils";

export const useProcessApi = () => {
  const { post, get } = useApi();
  const { objectToMap, mapToObject } = useMapUtils();
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
            ? mapToObject(process.additionalData)
            : {},
      });
    },

    filter: async (filter: Partial<ProcessFilter>): Promise<Process[]> => {
      var params = new URLSearchParams(filter as any);
      var result = await get<Process[]>(
        `/Process/FilterProcesses?${params.toString()}`
      );
      return [
        ...result.map((process) => {
          return {
            ...process,
            client: {
              ...process.client.map((c) => {
                c.fieldValues = objectToMap(c.fieldValues);
                return c;
              }),
            },
          };
        }),
      ];
    },

    getOne: async (id: string): Promise<Process> => {
      const result = await get<Process>(`/Process/GetProcess/${id}`);
      return {
        ...result,
        client: [
          ...result.client.map((c) => {
            c.fieldValues = objectToMap(c.fieldValues);
            return c;
          }),
        ],
      };
    },

    getMany: async (page: number, pageSize: number): Promise<Process[]> => {
      const result = await get<Process[]>(
        `/Process/FilterProcesses?page=${page}&pageSize=${pageSize}`
      );
      return [
        ...result.map((process) => {
          return {
            ...process,
            client: {
              ...process.client.map((c) => {
                c.fieldValues = objectToMap(c.fieldValues);
                return c;
              }),
            },
          };
        }),
      ];
    },

    update: async (process: Process): Promise<Process> => {
      const result = (await post("/Process/UpdateProcess", {
        ...process,
        additionalData:
          process.additionalData.size > 0
            ? Object.fromEntries(process.additionalData)
            : {},
      })) as Process;

      return {
        ...result,
        client: [
          ...result.client.map((c) => {
            c.fieldValues = objectToMap(c.fieldValues);
            return c;
          }),
        ],
      };
    },

    async addEvent(processId: string, event: ProcessEvent): Promise<Process> {
      var result = (await post(
        `Process/AddEvent/${processId}`,
        event
      )) as Process;
      return {
        ...result,
        client: [
          ...result.client.map((c) => {
            c.fieldValues = objectToMap(c.fieldValues);
            return c;
          }),
        ],
      };
    },

    async upsertComment(
      processId: string,
      comment: ProcessComment
    ): Promise<Process> {
      let result: Process = {} as Process;
      if (comment.id)
        result = (await post(
          `Process/UpdateComment/${processId}`,
          comment
        )) as Process;
      result = await post(`Process/AddComment/${processId}`, {
        comment: comment.comment,
      });

      return {
        ...result,
        client: [
          ...result.client.map((c) => {
            c.fieldValues = objectToMap(c.fieldValues);
            return c;
          }),
        ],
      };
    },

    async deleteComment(
      processId: string,
      commentId: string
    ): Promise<Process> {
      const result: Process = await post(`Process/RemoveComment/${processId}`, {
        commentId: commentId,
      });

      return {
        ...result,
        client: [
          ...result.client.map((c) => {
            c.fieldValues = objectToMap(c.fieldValues);
            return c;
          }),
        ],
      };
    },

    async addTask(processId: string, task: ProcessTask): Promise<ProcessTask> {
      return post(`Process/AddTask/${processId}`, task);
    },

    async completeTask(
      processId: string,
      task: ProcessTask
    ): Promise<ProcessTask> {
      return post(`Process/CompleteTask/${processId}`, task);
    },

    async uncompleteTask(
      processId: string,
      task: ProcessTask
    ): Promise<ProcessTask> {
      return post(`Process/UncompleteTask/${processId}`, task);
    },
  };
};
