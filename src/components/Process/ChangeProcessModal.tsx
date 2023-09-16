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
import { Process, ProcessTask } from "../../types/app.types";
import {
  addCircleSharp,
  closeSharp,
  linkSharp,
  listSharp,
} from "ionicons/icons";
import { useState } from "react";
import { ProcessInitialDataForm } from "./ProcessInitialDataForm";
import { ProcessAdditionalDataForm } from "./ProcessAdditionalDataForm";
import { ProcessBindingsForms } from "./ProcessBindingForm/ProcessBindingsForm";
import { atom, useAtom } from "jotai";
import { processBindingFormsState } from "./ProcessBindingForm/useProcessBindingFormController";

export const changeProcessAtom = atom<Process>({} as Process);

export type ChangeProcessModalProps = {
  onDismiss: (data: Process | null, action: "add" | "edit" | "cancel") => void;
};

export const ChangeProcessModal = (props: ChangeProcessModalProps) => {

  const [process] = useAtom(changeProcessAtom);
  const [processBinding] = useAtom(processBindingFormsState)
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
    if (process.title == null || process.title == "")
      return errorToast("O nome do processo não pode ser vazio");
    if (process.description == null || process.description == "")
      return errorToast("A descrição do processo não pode ser vazia");
    if (process.client == null)
      return errorToast("O cliente do processo não pode ser vazio");

    props.onDismiss(process, process.id == null ? "add" : "edit");
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton
              color="medium"
              onClick={(e) => props.onDismiss(null, "cancel")}
            >
              <IonIcon icon={closeSharp}></IonIcon>
            </IonButton>
          </IonButtons>
          <IonTitle>
            {process.title
              ? `Editar processo ${process.title}`
              : "Novo processo"}
          </IonTitle>
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
        {segment == "bindings" && <ProcessBindingsForms />}
        {segment == "initial-data" && <ProcessInitialDataForm configuration={processBinding.selectedProcessConfiguration} />}
        {segment == "additional-data" && <ProcessAdditionalDataForm configuration={processBinding.selectedProcessConfiguration}/>}
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonSegment
            value={segment}
            onIonChange={(e) => setSegment(e.detail.value as any)}
          >
            <IonSegmentButton value="bindings">
              <IonIcon icon={linkSharp}></IonIcon>
            </IonSegmentButton>
            <IonSegmentButton value="initial-data">
              <IonIcon icon={listSharp}></IonIcon>
            </IonSegmentButton>
            <IonSegmentButton value="additional-data">
              <IonIcon icon={addCircleSharp}></IonIcon>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};
