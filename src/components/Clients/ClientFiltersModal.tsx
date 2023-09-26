import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonNote,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useState } from "react";
import {
  ClientConfiguration,
} from "../../types/app.types";
import { ClientForm } from "./ClientForm";

export type ClientFiltersModalParams = {
  currentFilters: { [key: string]: string };
  clientConfiguration: ClientConfiguration | null;
  onDismiss: (
    data: { [key: string]: string } | null,
    action: ClientFiltersAction
  ) => void;
};

export type ClientFiltersAction = "apply" | "cancel";

export const ClientFiltersModal = (props: ClientFiltersModalParams) => {
  const [filters, setFilters] = useState<{ [key: string]: string }>(
    props.currentFilters ?? []
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="secondary">
          <IonButtons slot="start">
            <IonButton
              color="medium"
              onClick={(e) => props.onDismiss(null, "cancel")}
            >
              Cancelar
            </IonButton>
          </IonButtons>
          <IonTitle>Gerenciar Filtros</IonTitle>
          <IonButtons slot="end">
            <IonButton
              color="danger"
              fill="clear"
              onClick={(e) => props.onDismiss({}, "apply")}
            >
              Limpar
            </IonButton>
            <IonButton
              color="success"
              fill="clear"
              onClick={(e) => props.onDismiss(filters, "apply")}
            >
              Salvar
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonNote className="ion-padding">
          Preencha abaixo os valores que deseja filtrar
        </IonNote>
        {props.clientConfiguration && (
          <ClientForm
            clientConfiguration={props.clientConfiguration}
            client={{
              id: null,
              clientTypeId: props.clientConfiguration.id!,
              fieldValues: filters,
              clientConfiguration: props.clientConfiguration,
            }}
            setClient={(client) => {
              setFilters(client.fieldValues);
            }}
          />
        )}
      </IonContent>
    </IonPage>
  );
};
