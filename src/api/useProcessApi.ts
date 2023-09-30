import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { useClient } from "../common/useClient";
import {
  Process,
  ProcessComment,
  ProcessEvent,
  ProcessFilter,
  ProcessTask,
  ProcessesByStatus,
} from "../types/app.types";
import { useApi } from "./useApi";

export const useGetProcesses = (filter: Partial<ProcessFilter>) => {
  const { get } = useApi();

  return useInfiniteQuery(
    ["getProcesses", filter],
    async ({ pageParam = filter.pageSize ?? 10 }) => {
      var params = new URLSearchParams({
        ...filter,
        pageSize: pageParam,
      } as any);
      return await get<Process[]>(
        `/Process/FilterProcesses?${params.toString()}`
      );
    }
  );
};

export const useGetProcess = (id: string) => {
  const { get } = useApi();

  return useQuery(["getProcess", id], async () => {
    return await get<Process>(`/Process/GetProcess/${id}`);
  });
};

export const useGetProcessByStatus = () => {
  const { get } = useApi();

  return useQuery(["getProcessByStatus"], async () => {
    return await get<ProcessesByStatus>(`/Process/GroupedByStatus`);
  });
};

export const useSaveProcess = () => {
  const { post } = useApi();
  const queryClient = useQueryClient();

  return useMutation(
    ["saveProcess"],
    async (process: Process) => {
      return await post<Process, Process>("/Process/CreateProcess", process);
    },
    {
      onSuccess: (result, variables) => {
        queryClient.invalidateQueries("getProcesses");
        queryClient.setQueryData<Process[]>("getProcesses", (old) => {
          if (!old) return [{ ...variables, id: result.id }];
          return [
            ...old.filter((c) => c.id !== result.id),
            { ...variables, id: result.id },
          ];
        });
      },
    }
  );
};

export const useEditProcess = () => {
  const { post } = useApi();
  const { inferConfigurationFromClient } = useClient();
  const queryClient = useQueryClient();

  return useMutation(
    ["editProcess"],
    async (process: Process) => {
      process.client = process.client.map((client) => {
        if (!client.clientConfiguration)
          client.clientConfiguration = {
            fieldConfigurations: inferConfigurationFromClient(client),
            id: "",
            name: "",
          };
        return client;
      });
      return await post<Process, Process>("/Process/UpdateProcess", process);
    },
    {
      onSuccess: (result, variables) => {
        queryClient.invalidateQueries("getProcesses");
        queryClient.invalidateQueries(["getProcess", variables.id]);
        queryClient.setQueryData<Process[]>("getProcesses", (old) => {
          if (!old) return [{ ...variables, id: result.id }];
          return [
            ...old.filter((c) => c.id !== result.id),
            { ...variables, id: result.id },
          ];
        });
      },
    }
  );
};

interface AddEventMutationVariables {
  processId: string;
  event: ProcessEvent;
}

export const useAddEventMutation = () => {
  const { post } = useApi();
  const queryClient = useQueryClient();

  return useMutation(
    ["addEvent"],
    async ({ processId, event }: AddEventMutationVariables) => {
      return await post<ProcessEvent, Process>(
        `/Process/AddEvent/${processId}`,
        event
      );
    },
    {
      onSuccess: (result, variables) => {
        queryClient.setQueryData<Process>(
          ["getProcess", variables.processId],
          (old) => {
            if (!old) return {} as Process;
            return {
              ...old,
              events: [...old.events, variables.event],
            };
          }
        );
      },
    }
  );
};

interface AddCommentMutationVariables {
  processId: string;
  comment: ProcessComment;
}

export const useAddCommentMutation = () => {
  const { post } = useApi();
  const queryClient = useQueryClient();

  return useMutation(
    ["addComment"],
    async ({ processId, comment }: AddCommentMutationVariables) => {
      return await post<ProcessComment, Process>(
        `/Process/AddComment/${processId}`,
        comment
      );
    },
    {
      onSuccess: (result, variables) => {
        queryClient.setQueryData<Process>(
          ["getProcess", variables.processId],
          (old) => {
            if (!old) return {} as Process;
            return {
              ...old,
              comments: [...old.comments, variables.comment],
            };
          }
        );
      },
    }
  );
};

export const useUpdateCommentMutation = () => {
  const { post } = useApi();
  const queryClient = useQueryClient();

  return useMutation(
    ["updateComment"],
    async ({ processId, comment }: AddCommentMutationVariables) => {
      return await post<ProcessComment, Process>(
        `/Process/UpdateComment/${processId}`,
        comment
      );
    },
    {
      onSuccess: (result, variables) => {
        queryClient.setQueryData<Process>(
          ["getProcess", variables.processId],
          (old) => {
            if (!old) return {} as Process;
            return {
              ...old,
              comments: [
                ...old.comments.filter((c) => c.id !== variables.comment.id),
                variables.comment,
              ],
            };
          }
        );
      },
    }
  );
};

export const useAddTaskMutation = () => {
  const { post } = useApi();
  const queryClient = useQueryClient();

  return useMutation(
    ["addTask"],
    async ({ processId, task }: { processId: string; task: ProcessTask }) => {
      return await post<ProcessTask, Process>(
        `/Process/AddTask/${processId}`,
        task
      );
    },
    {
      onSuccess: (result, variables) => {
        queryClient.setQueryData<Process>(
          ["getProcess", variables.processId],
          (old) => {
            if (!old) return {} as Process;
            return {
              ...old,
              tasks: [...old.tasks, variables.task],
            };
          }
        );
      },
    }
  );
};

export const useDeleteCommentMutation = () => {
  const { post } = useApi();
  const queryClient = useQueryClient();

  return useMutation(
    ["deleteComment"],
    async ({
      processId,
      commentId,
    }: {
      processId: string;
      commentId: string;
    }) =>
      await post<{ commentId: string }, Process>(
        `/Process/RemoveComment/${processId}`,
        { commentId: commentId }
      ),
    {
      onSuccess: (result, variables) => {
        queryClient.setQueryData<Process>(
          ["getProcess", variables.processId],
          (old) => {
            if (!old) return {} as Process;
            return {
              ...old,
              comments: [
                ...old.comments.filter((c) => c.id !== variables.commentId),
              ],
            };
          }
        );
      },
    }
  );
};

export const useCompleteTaskMutation = () => {
  const { post } = useApi();
  const queryClient = useQueryClient();

  return useMutation(
    ["completeTask"],
    async ({ processId, task }: { processId: string; task: ProcessTask }) => {
      return await post<ProcessTask, Process>(
        `/Process/CompleteTask/${processId}`,
        task
      );
    },
    {
      onSuccess: (result, variables) => {
        queryClient.setQueryData<Process>(
          ["getProcess", variables.processId],
          (old) => {
            if (!old) return {} as Process;
            return {
              ...old,
              tasks: [
                ...old.tasks.filter((c) => c.id !== variables.task.id),
                { ...variables.task, isCompleted: true },
              ],
            };
          }
        );
      },
    }
  );
};

export const useUnCompleteTaskMutation = () => {
  const { post } = useApi();
  const queryClient = useQueryClient();

  return useMutation(
    ["completeTask"],
    async ({ processId, task }: { processId: string; task: ProcessTask }) => {
      return await post<ProcessTask, Process>(
        `/Process/UncompleteTask/${processId}`,
        task
      );
    },
    {
      onSuccess: (result, variables) => {
        queryClient.setQueryData<Process>(
          ["getProcess", variables.processId],
          (old) => {
            if (!old) return {} as Process;
            return {
              ...old,
              tasks: [
                ...old.tasks.filter((c) => c.id !== variables.task.id),
                { ...variables.task, isCompleted: false },
              ],
            };
          }
        );
      },
    }
  );
};
