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
import { Process, ProcessTask } from "../../types/app.types";
import { useAtom } from "jotai";
import { changeProcessAtom } from "./ChangeProcessModal";
import { addSharp, closeSharp } from "ionicons/icons";
import { useState } from "react";

export const ProcessInitialDataForm = () => {
  const [process, setProcess] = useAtom(changeProcessAtom);
  const [edittingTask, setEdittingTask] = useState<string>("");

  function handleAddTask() {
    if (!edittingTask) return;

    setProcess(process => ({
      ...process,
      tasks: [...process.tasks ?? [], {
        title: edittingTask,
        isCompleted: false
      } as ProcessTask]
    }));

    setEdittingTask("");
  }

  function handleRemoveTask(title: string) {
    setProcess(process => ({
      ...process,
      tasks: process.tasks?.filter(task => task.title !== title)
    }));

    setEdittingTask("");
  }

  return (
    <>
      <IonInput
        label="Nome do processo"
        labelPlacement="floating"
        fill="solid"
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
        fill="solid"
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
        fill="solid"
        value={process?.SLA}
        onIonChange={(e) =>
          setProcess({
            ...(process ?? ({} as Process)),
            SLA: e.detail.value ? parseInt(e.detail.value) : 0,
          })
        }
        style={{ marginBottom: "1rem" }}
      />
      <IonInput
        label="Responsável"
        labelPlacement="floating"
        fill="solid"
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
        <IonItem color="light">
          <IonInput
            label="Novo item"
            labelPlacement="floating"
            value={edittingTask}
            onIonInput={(e) => setEdittingTask(e.detail.value ?? "")}
          />
          <IonButtons slot="end">
            <IonButton fill="solid" color="primary" onClick={e => handleAddTask()}>
              <IonIcon icon={addSharp}></IonIcon>
            </IonButton>
          </IonButtons>
        </IonItem>
        {process?.tasks?.map((task, index) => (
          <IonItem key={index}>
            <IonLabel>{task.title}</IonLabel>
            <IonButtons slot="end">
            <IonButton color="danger" onClick={e => handleRemoveTask(task.title)}>
              <IonIcon icon={closeSharp}></IonIcon>
            </IonButton>
          </IonButtons>
          </IonItem>
        ))}
      </IonList>
    </>
  );
};
