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
  IonItemDivider,
  IonNote,
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
import { SelectProcessType } from "./SelectProcessType";
import { useProcessBindingFormController } from "./ProcessBindingForm/useProcessBindingFormController";

export const ProcessInitialDataForm = ({
  configuration,
}: {
  configuration: ProcessConfiguration | null | undefined;
}) => {
  const [process, setProcess] = useAtom(changeProcessAtom);
  const [edittingTask, setEdittingTask] = useState<string>("");
  const controller = useProcessBindingFormController();

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
      <IonNote>
        Se você já criou um processo desse tipo antes, selecione abaixo
      </IonNote>
      <SelectProcessType
        processTypes={controller.state.processConfigurations}
        defaultValue={controller.state.selectedProcessConfiguration}
        onSelected={(processType) =>
          controller.setSelectedProcessConfiguration(processType.id)
        }
      />
      <IonItemDivider />

      <IonNote>
        <p>
          Se ainda não criou um processo desse tipo, digite abaixo as
          informações necessárias
        </p>
      </IonNote>

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
      <IonItemDivider />
      <h2>Checklist do Processo</h2>
      <AddTaskForm
        task={edittingTask}
        onTaskChange={(task) => {
          setEdittingTask(task);
          handleAddTask();
        }}
      />
      <IonList>
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
