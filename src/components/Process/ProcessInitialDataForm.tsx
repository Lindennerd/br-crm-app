import {
  IonInput,
  IonTextarea,
  IonList,
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
import { closeSharp } from "ionicons/icons";
import { Dispatch, SetStateAction, useState } from "react";
import { AddTaskForm } from "./Forms/AddTaskForm";
import { SelectProcessType } from "./SelectProcessType";

export type ProcessInitialDataFormProps = {
  configurations: ProcessConfiguration[];
  process: Process | null;
  setProcess: Dispatch<SetStateAction<Process | null>>;
  onSetSelectedConfiguration: (configuration: ProcessConfiguration) => void;
};

export const ProcessInitialDataForm = (props: ProcessInitialDataFormProps) => {
  const [selectedConfiguration, setSelectedConfiguration] =
    useState<ProcessConfiguration>();
  const [edittingTask, setEdittingTask] = useState<string>("");

  function handleSelectedConfiguration(configuration: ProcessConfiguration) {
    setSelectedConfiguration(configuration);
    props.onSetSelectedConfiguration(configuration);
  }

  function handleAddTask() {
    if (!edittingTask) return;
    props.setProcess((process) => ({
      ...(props.process ?? ({} as Process)),
      tasks: [
        ...(process?.tasks ?? []),
        { title: edittingTask } as ProcessTask,
      ],
    }));
    setEdittingTask("");
  }

  function handleRemoveTask(title: string) {
    props.setProcess((process) => ({
      ...(props.process ?? ({} as Process)),
      tasks: [...(process?.tasks ?? [])].filter((task) => task.title !== title),
    }));
    setEdittingTask("");
  }

  return (
    <>
      <IonNote>
        Se você já criou um processo desse tipo antes, selecione abaixo
      </IonNote>
      <SelectProcessType
        processTypes={props.configurations}
        onSelected={(processType) => handleSelectedConfiguration(processType)}
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
        value={props.process?.title}
        onIonChange={(e) =>
          props.setProcess({
            ...(props.process ?? ({} as Process)),
            title: e.detail.value ?? "",
          })
        }
        style={{ marginBottom: "1rem" }}
      />
      <IonTextarea
        label="Descrição do processo"
        labelPlacement="floating"
        value={props.process?.description}
        onIonChange={(e) =>
          props.setProcess({
            ...(props.process ?? ({} as Process)),
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
        value={props.process?.sla}
        onIonChange={(e) =>
          props.setProcess({
            ...(props.process ?? ({} as Process)),
            sla: e.detail.value ? parseInt(e.detail.value) : 0,
          })
        }
        style={{ marginBottom: "1rem" }}
      />
      <IonInput
        label="Responsável"
        labelPlacement="floating"
        value={props.process?.executor}
        onIonChange={(e) =>
          props.setProcess({
            ...(props.process ?? ({} as Process)),
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
        {props.process?.tasks?.map((task, index) => (
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
