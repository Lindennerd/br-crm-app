import {
  IonButton,
  IonButtons,
  IonIcon,
  IonNote,
  IonTitle,
  IonToolbar,
  useIonModal,
} from "@ionic/react";
import { person } from "ionicons/icons";
import {
  useAddCommentMutation,
  useAddEventMutation,
  useAddTaskMutation,
  useCompleteTaskMutation,
  useDeleteCommentMutation,
  useEditProcess,
  useGetProcess,
  useUnCompleteTaskMutation,
  useUpdateCommentMutation,
} from "../../api/useProcessApi";
import { useClient } from "../../common/useClient";
import { ClientDetailsModal } from "../../components/Clients/ClientDetailsModal";
import { ProcessCommentsList } from "../../components/Process/Lists/ProcessCommentsList";
import { ProcessEventsList } from "../../components/Process/Lists/ProcessEventsList";
import { ProcessInformationList } from "../../components/Process/Lists/ProcessInformationList";
import { ProcessTasksList } from "../../components/Process/Lists/ProcessTasksList";
import { ProcessStatusBadge } from "../../components/Process/ProcessStatusBadge";
import {
  ProcessComment,
  ProcessEvent,
  ProcessTask,
} from "../../types/app.types";

export interface ProcessDetailsPageProps {
  processId: string;
}

export const ProcessDetailsPage = (props: ProcessDetailsPageProps) => {
  const { displayFirstField, inferConfigurationFromClient } = useClient();

  const { data: process } = useGetProcess(props.processId);
  const editProcessMutation = useEditProcess();
  const addTaskMutation = useAddTaskMutation();
  const completeTaskMutation = useCompleteTaskMutation();
  const unCompleteTaskMutation = useUnCompleteTaskMutation();
  const addEventMutation = useAddEventMutation();
  const addCommentMutation = useAddCommentMutation();
  const editCommentMutation = useUpdateCommentMutation();
  const deleteCommentMutation = useDeleteCommentMutation();

  const [presentClientDetailsModal, dismissClientDetailsModal] = useIonModal(
    ClientDetailsModal,
    {
      client: process?.client[0],
      onDismiss: () => {
        dismissClientDetailsModal();
      },
    }
  );

  function handleAddAdditionalData(field: string, value: string) {
    if (!process) return;
    if (!field || !value) return;

    editProcessMutation.mutate({
      ...process,
      additionalData: { ...process.additionalData, [field]: value },
    });
  }

  function handleAddTask(task: ProcessTask) {
    if (!process) return;
    if (!task) return;
    addTaskMutation.mutate({ processId: process.id, task });
  }

  function handleCompleteTask(task: ProcessTask): void {
    if (!process) return;
    if (!task) return;
    if (task.isCompleted)
      unCompleteTaskMutation.mutate({ processId: process.id, task: task });
    else completeTaskMutation.mutate({ processId: process.id, task: task });
  }

  function handleEventChange(event: ProcessEvent): void {
    if (!process) return;
    if (!event) return;
    addEventMutation.mutate({ processId: process.id, event });
  }

  function handleCommentChange(comment: ProcessComment): void {
    if (!process) return;
    if (!comment) return;
    if (comment.id) {
      editCommentMutation.mutate({ processId: process.id, comment });
    } else {
      addCommentMutation.mutate({ processId: process.id, comment });
    }
  }

  function handleDeleteComment(comment: ProcessComment): void {
    if (!process) return;
    if (!comment || !comment.id) return;
    deleteCommentMutation.mutate({
      processId: process.id,
      commentId: comment.id,
    });
  }

  if (!process) return <></>;
  return (
    <>
      <IonToolbar color="secondary">
        <IonTitle slot="start">
          Processo {process.title} de{" "}
          {process &&
            displayFirstField(
              process.client[0],
              inferConfigurationFromClient(process.client[0])
            )}
        </IonTitle>
        <ProcessStatusBadge
          status={process.status}
          slot="end"
          style={{ marginRight: "1rem" }}
        />
        <IonButtons slot="end" style={{ marginRight: "1em" }}>
          <IonButton
            color="tertiary"
            fill="solid"
            onClick={(e) => presentClientDetailsModal()}
          >
            <IonIcon icon={person} />
          </IonButton>
        </IonButtons>
      </IonToolbar>

      <div>
        <IonNote class="ion-padding">{process.description}</IonNote>

        <ProcessInformationList
          additionalData={process.additionalData}
          onAdd={handleAddAdditionalData}
        />
        <ProcessTasksList
          tasks={process.tasks}
          onTaskChange={handleAddTask}
          setCompletedTask={(task) => handleCompleteTask(task)}
        />
        <ProcessEventsList
          events={process.events.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )}
          onEventChange={handleEventChange}
        />
        <ProcessCommentsList
          comments={process.comments}
          onCommentChange={handleCommentChange}
          onDeletedComment={handleDeleteComment}
        />
      </div>
    </>
  );
};
