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
} from "@ionic/react";
import { Process, ProcessTask } from "../../types/app.types";
import { closeSharp } from "ionicons/icons";
import { useState } from "react";
import { ProcessInitialDataForm } from "./ProcessInitialDataForm";
import { ProcessAdditionalDataForm } from "./ProcessAdditionalDataForm";
import { ProcessBindingsForms } from "./ProcessBindingsForm";
import { atom, useAtom } from "jotai";

export const changeProcessAtom = atom<Process>({} as Process);

export type ChangeProcessModalProps = {
  onDismiss: (data: Process | null, action: "add" | "edit" | "cancel") => void;
};

export const ChangeProcessModal = (props: ChangeProcessModalProps) => {
  const [process] = useAtom(changeProcessAtom);

  const [segment, setSegment] = useState<
    "bindings" | "initial-data" | "additional-data"
  >("bindings");

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
              onClick={(e) =>
                props.onDismiss(process, process == null ? "add" : "edit")
              }
            >
              Salvar
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding">
        {segment == "bindings" && <ProcessBindingsForms />}
        {segment == "initial-data" && <ProcessInitialDataForm />}
        {segment == "additional-data" && <ProcessAdditionalDataForm />}
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonSegment
            value={segment}
            onIonChange={(e) => setSegment(e.detail.value as any)}
          >
            <IonSegmentButton value="bindings">
              <IonLabel>Vículos</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="initial-data">
              <IonLabel>Dados Principais</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="additional-data">
              <IonLabel>Dados Adicionais</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};
