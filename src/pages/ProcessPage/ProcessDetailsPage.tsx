import { useEffect, useState } from "react";
import {
  Process,
  ProcessComment,
  ProcessEvent,
  ProcessTask,
} from "../../types/app.types";
import { useProcessApi } from "../../api/useProcessApi";
import {
  IonTitle,
  IonToolbar,
  IonLoading,
  useIonToast,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonNote,
  IonItemDivider,
  useIonModal,
  IonBadge,
} from "@ionic/react";
import { useMapUtils } from "../../api/useMapUtils";
import { pencilSharp, person } from "ionicons/icons";
import { ClientDetailsModal } from "../../components/Clients/ClientDetailsModal";
import { ProcessInformationList } from "../../components/Process/Lists/ProcessInformationList";
import { ProcessTasksList } from "../../components/Process/Lists/ProcessTasksList";
import { ProcessEventsList } from "../../components/Process/Lists/ProcessEventsList";
import { ProcessCommentsList } from "../../components/Process/Lists/ProcessCommentsList";
import { useProcessPageController } from "./ProcessPage.Controller";
import { ProcessStatusBadge } from "../../components/Process/ProcessStatusBadge";
import { useLoadingContext } from "../../context/LoadingContext";

export interface ProcessDetailsPageProps {
  processId: string;
}

export const ProcessDetailsPage = (props: ProcessDetailsPageProps) => {
  const { setLoading } = useLoadingContext();
  const [process, setProcess] = useState<Process | null>(null);
  const [presetToast] = useIonToast();
  const { getFirstValue } = useMapUtils();
  const {
    getOne,
    update,
    addEvent,
    upsertComment,
    deleteComment,
    completeTask,
    uncompleteTask,
    addTask
  } = useProcessApi();

  const [presentClientDetailsModal, dismissClientDetailsModal] = useIonModal(
    ClientDetailsModal,
    {
      client: process?.client[0],
      onDismiss: () => {
        dismissClientDetailsModal();
      },
    }
  );

  useEffect(() => {
    setLoading(true);
    getOne(props.processId)
      .then((process) => {
        setProcess({
          ...process,
          additionalData: new Map(Object.entries(process.additionalData)),
        });
      })
      .catch((err) => {
        console.error(err);
        presetToast({
          message: "Erro ao buscar as informações do process",
          duration: 2000,
          color: "danger",
          position: "top",
        });
      })
      .finally(() => setLoading(false));
  }, [props.processId]);

  function handleAddAdditionalData(field: string, value: string) {
    if (!process) return;
    if (process?.additionalData == null)
      process.additionalData = new Map<string, string>();

    if (field && value) {
      process.additionalData.set(field, value);
      setProcess({
        ...process,
        additionalData: new Map(process.additionalData),
      });
      update(process).catch((err) => {
        console.error(err);
        presetToast({
          message: "Erro ao atualizar as informações do processo",
          duration: 2000,
          color: "danger",
          position: "top",
        });
      });
    }
  }

  function handleAddTask(task: ProcessTask) {
    if (!process) return;
    if (!task) return;
    addTask(process.id, task)
      .then((res) => {
        console.log(res);
        setProcess((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            tasks: [...prev.tasks, res],
          };
        });
      })
      .catch((err) => {
        console.error(err);
        presetToast({
          message: "Erro ao atualizar as informações do processo",
          duration: 2000,
          color: "danger",
          position: "top",
        });
      });
  }

  function handleCompleteTask(task: ProcessTask): void {
    if (!process) return;
    if (!task) return;
    setLoading(true);
    (task.isCompleted
      ? uncompleteTask(process.id, task)
      : completeTask(process.id, task)
    )
      .then((res) => {
        setProcess((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            tasks: prev.tasks.map((t) => {
              if (t.id === task.id) {
                return res;
              }
              return t;
            }),
          };
        });
      })
      .catch((err) => {
        console.error(err);
        presetToast({
          message: "Erro ao atualizar as informações do processo",
          duration: 2000,
          color: "danger",
          position: "top",
        });
      })
      .finally(() => setLoading(false));
  }

  function handleEventChange(event: ProcessEvent): void {
    if (!process) return;
    if (!event) return;
    setProcess({ ...process });
    addEvent(process.id, event)
      .then((res) => {
        setProcess((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            events: res.events,
          };
        });
      })
      .catch((err) => {
        console.error(err);
        presetToast({
          message: "Erro ao atualizar as informações do processo",
          duration: 2000,
          color: "danger",
          position: "top",
        });
      });
  }

  function handleCommentChange(comment: ProcessComment): void {
    if (!process) return;
    if (!comment) return;
    setProcess({ ...process });
    setLoading(true);
    upsertComment(process.id, comment)
      .then((res) => {
        setProcess((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            comments: res.comments,
          };
        });
      })
      .catch((err) => {
        console.error(err);
        presetToast({
          message: "Erro ao atualizar as informações do processo",
          duration: 2000,
          color: "danger",
          position: "top",
        });
      })
      .finally(() => setLoading(false));
  }

  function handleDeleteComment(comment: ProcessComment): void {
    if (!process) return;
    if (!comment || !comment.id) return;
    setLoading(true);
    deleteComment(process.id, comment.id)
      .then((res) => {
        setProcess((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            comments: res.comments,
          };
        });
      })
      .catch((err) => {
        console.error(err);
        presetToast({
          message: "Erro ao atualizar as informações do processo",
          duration: 2000,
          color: "danger",
          position: "top",
        });
      })
      .finally(() => setLoading(false));
  }

  if (!process) return <></>;
  return (
    <>
      <IonToolbar color="secondary">
        <IonTitle slot="start">
          Processo {process.title} de{" "}
          {process && getFirstValue(process.client[0])}
        </IonTitle>
        <ProcessStatusBadge
          status={process.status}
          slot="end"
          style={{ marginRight: "1rem" }}
        />
        <IonButtons slot="end" style={{ marginRight: "1em" }}>
          <IonButton color="tertiary" fill="solid">
            <IonIcon icon={pencilSharp} />
          </IonButton>
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

        {process.additionalData.size > 0 && (
          <ProcessInformationList
            additionalData={process.additionalData}
            onAdd={handleAddAdditionalData}
          />
        )}
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
