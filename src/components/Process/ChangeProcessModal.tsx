import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonLabel,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
  useIonToast,
} from "@ionic/react";
import { Client, Process, ProcessConfiguration } from "../../types/app.types";
import {
  closeSharp,
  documentAttachSharp,
  listSharp,
  personAddSharp,
} from "ionicons/icons";
import { useState } from "react";
import { ProcessInitialDataForm } from "./ProcessInitialDataForm";
import { ProcessAdditionalDataForm } from "./ProcessAdditionalDataForm";
import { ProcessBindingsForms } from "./ProcessBindingForm/ProcessBindingsForm";
import { useGetProcessConfigurations } from "../../api/useConfigurationApi";
import { useEditProcess, useSaveProcess } from "../../api/useProcessApi";

export type ChangeProcessModalProps = {
  onDismiss: (data: Process | null, action: "add" | "edit" | "cancel") => void;
  process: Process | null;
};

export const ChangeProcessModal = (props: ChangeProcessModalProps) => {
  const { data: configurations } = useGetProcessConfigurations();
  const saveProcessMutation = useSaveProcess();
  const editProcessMutation = useEditProcess();

  const [process, setProcess] = useState<Process | null>(props.process);
  const [presentToast] = useIonToast();

  const [segment, setSegment] = useState<
    "bindings" | "initial-data" | "additional-data"
  >("bindings");

  function errorToast(message: string) {
    presentToast({
      message,
      color: "danger",
      duration: 2000,
      position: "top",
    });
  }

  function handleSave() {
    if (!process) return;
    if (process.title == null || process.title == "")
      return errorToast("O nome do processo não pode ser vazio");
    if (process.description == null || process.description == "")
      return errorToast("A descrição do processo não pode ser vazia");
    if (process.clientId == null)
      return errorToast("O cliente do processo não pode ser vazio");

    if(process.id) editProcessMutation.mutate(process);
    else saveProcessMutation.mutate(process);

    props.onDismiss(process, process.id == null ? "add" : "edit");
  }

  function handleSelectedClient(client: Client | undefined) {
    client &&
      client.id &&
      setProcess({
        ...(process ?? ({} as Process)),
        clientId: client.id,
        client: [client],
      });
  }

  function handleSelectedConfiguration(configuration: ProcessConfiguration) {
    setProcess({
      ...(process ?? ({} as Process)),
      title: configuration.title,
      description: configuration.description,
      tasks: [...configuration.tasks],
      additionalData: configuration.additionalData,
      sla: configuration.sla,
      executor: configuration.executor,
    });
  }

  function handleAddAdditionalData(field: string, value: string) {
    setProcess({
      ...(process ?? ({} as Process)),
      additionalData: {
        ...(process?.additionalData ?? {}),
        [field]: value,
      },
    });
  }

  function handleRemoveAdditionalData(field: string) {
    delete process?.additionalData[field];
    setProcess({
      ...(process ?? ({} as Process)),
      additionalData: process?.additionalData ?? {},
    });
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="secondary">
          <IonButtons slot="start">
            <IonButton
              color="medium"
              onClick={(e) => props.onDismiss(null, "cancel")}
            >
              <IonIcon icon={closeSharp}></IonIcon>
            </IonButton>
          </IonButtons>
          <IonTitle>Novo Processo</IonTitle>
          <IonButtons slot="end">
            <IonButton
              color="success"
              fill="clear"
              onClick={(e) => handleSave()}
            >
              Salvar
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding">
        {segment == "bindings" && (
          <ProcessBindingsForms
            client={process?.client[0] ?? undefined}
            setClient={(client) => handleSelectedClient(client)}
          />
        )}
        {segment == "initial-data" && (
          <ProcessInitialDataForm
            process={process}
            setProcess={setProcess}
            configurations={configurations ?? []}
            onSetSelectedConfiguration={(configuration) =>
              handleSelectedConfiguration(configuration)
            }
          />
        )}
        {segment == "additional-data" && (
          <ProcessAdditionalDataForm
            process={process}
            removeAdditionalData={(field) => handleRemoveAdditionalData(field)}
            addAdditionalData={(field, value) =>
              handleAddAdditionalData(field, value)
            }
          />
        )}
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonSegment
            value={segment}
            onIonChange={(e) => setSegment(e.detail.value as any)}
          >
            <IonSegmentButton value="bindings">
              <IonLabel>CLIENTE</IonLabel>
              <IonIcon icon={personAddSharp}></IonIcon>
            </IonSegmentButton>
            <IonSegmentButton value="initial-data">
              <IonLabel>PROCESSO</IonLabel>
              <IonIcon icon={documentAttachSharp}></IonIcon>
            </IonSegmentButton>
            <IonSegmentButton value="additional-data">
              <IonLabel>INFORMAÇÕES</IonLabel>
              <IonIcon icon={listSharp}></IonIcon>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};
