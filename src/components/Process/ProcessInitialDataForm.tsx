import {
  IonInput,
  IonTextarea,
} from "@ionic/react";
import { Process } from "../../types/app.types";
import { useAtom } from "jotai";
import { changeProcessAtom } from "./ChangeProcessModal";

export const ProcessInitialDataForm = () => {

  const [process, setProcess] = useAtom(changeProcessAtom);

  return (
    <>
      <IonInput
        label="Nome do processo"
        labelPlacement="floating"
        fill="solid"
        value={process?.title}
        onIonChange={(e) =>
          setProcess({ ...process ?? {} as Process, title: e.detail.value ?? "" })
        }
        style={{ marginBottom: "1rem" }}
      />
      <IonTextarea
        label="Descrição do processo"
        labelPlacement="floating"
        fill="solid"
        value={process?.description}
        onIonChange={(e) =>
          setProcess({ ...process ?? {} as Process, description: e.detail.value ?? "" })
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
            ...process ?? {} as Process,
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
          setProcess({ ...process ?? {} as Process, executor: e.detail.value ?? "" })
        }
        style={{ marginBottom: "1rem" }}
      />
    </>
  );
};
