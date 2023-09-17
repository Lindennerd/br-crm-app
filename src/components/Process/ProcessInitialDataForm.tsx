import {
  IonInput,
  IonTextarea,
  IonList,
  IonListHeader,
  IonLabel,
  IonItem,
  IonButtons,
  IonButton,
  IonIcon,
} from "@ionic/react";
import {
  Process,
  ProcessTask,
  ProcessConfiguration,
} from "../../types/app.types";
import { useAtom } from "jotai";
import { changeProcessAtom } from "./ChangeProcessModal";
import { addSharp, closeSharp } from "ionicons/icons";
import { useEffect, useState } from "react";
import { AddTaskForm } from "./Forms/AddTaskForm";

export const ProcessInitialDataForm = ({
  configuration,
}: {
  configuration: ProcessConfiguration | null | undefined;
}) => {
  const [process, setProcess] = useAtom(changeProcessAtom);
  const [edittingTask, setEdittingTask] = useState<string>("");

  useEffect(() => {
    if (configuration) {
      setProcess((prev) => {
        return {
          ...prev,
          title: configuration.title,
          description: configuration.description,
          sla: configuration.sla,
          executor: configuration.executor,
          additionalData: configuration.additionalData,
          tasks: configuration.tasks?.map((task) => {
            return {
              id: null,
              title: task.title,
              completedAt: null,
              createdAt: new Date(),
              isCompleted: false,
            };
          }),
        };
      });
    }
  }, [configuration]);

  function handleAddTask() {
    if (!edittingTask) return;

    setProcess((process) => ({
      ...process,
      tasks: [
        ...(process.tasks ?? []),
        {
          title: edittingTask,
        } as ProcessTask,
      ],
    }));

    setEdittingTask("");
  }

  function handleRemoveTask(title: string) {
    setProcess((process) => ({
      ...process,
      tasks: process.tasks?.filter((task) => task.title !== title),
    }));

    setEdittingTask("");
  }

  return (
    <>
      <IonInput
        label="Nome do processo"
        labelPlacement="floating"
        value={process?.title}
        onIonChange={(e) =>
          setProcess({
            ...(process ?? ({} as Process)),
            title: e.detail.value ?? "",
          })
        }
        style={{ marginBottom: "1rem" }}
      />
      <IonTextarea
        label="Descrição do processo"
        labelPlacement="floating"
        value={process?.description}
        onIonChange={(e) =>
          setProcess({
            ...(process ?? ({} as Process)),
            description: e.detail.value ?? "",
          })
        }
        style={{ marginBottom: "1rem" }}
      />
      <IonInput
        type="number"
        min={1}
        label="Prazo em dias"
        labelPlacement="floating"
        value={process?.sla}
        onIonChange={(e) =>
          setProcess({
            ...(process ?? ({} as Process)),
            sla: e.detail.value ? parseInt(e.detail.value) : 0,
          })
        }
        style={{ marginBottom: "1rem" }}
      />
      <IonInput
        label="Responsável"
        labelPlacement="floating"
        value={process?.executor}
        onIonChange={(e) =>
          setProcess({
            ...(process ?? ({} as Process)),
            executor: e.detail.value ?? "",
          })
        }
        style={{ marginBottom: "1rem" }}
      />
      <IonList>
        <IonListHeader>
          <IonLabel>Checklist do Processo</IonLabel>
        </IonListHeader>
        <AddTaskForm 
          task={edittingTask}
          onTaskChange={(task) => {
            setEdittingTask(task)
            handleAddTask()
          }}
        />
        {process?.tasks?.map((task, index) => (
          <IonItem key={index}>
            <IonLabel>{task.title}</IonLabel>
            <IonButtons slot="end">
              <IonButton
                color="danger"
                onClick={(e) => handleRemoveTask(task.title)}
              >
                <IonIcon icon={closeSharp}></IonIcon>
              </IonButton>
            </IonButtons>
          </IonItem>
        ))}
      </IonList>
    </>
  );
};
