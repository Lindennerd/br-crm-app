import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useState } from "react";
import {
  Client,
  ClientConfiguration,
  FieldConfiguration,
} from "../../types/app.types";
import { ClientForm } from "./ClientForm";
import { useMapUtils } from "../../api/useMapUtils";

export type ClientChangeAction = "add" | "edit" | "cancel";
export type ClientChangeModalParams = {
  onDismiss: (data: Client | null, action: ClientChangeAction) => void;
  client: Client | null;
  configuration: ClientConfiguration;
};

export const ClientChangeModal = ({
  onDismiss,
  client,
  configuration,
}: ClientChangeModalParams) => {
  const [changeClient, setChangeClient] = useState<Client>(
    client ?? ({} as Client)
  );

  function setFieldValue(
    value: string | number,
    field: FieldConfiguration
  ): void {
    return setChangeClient((prev) => {
      if (!prev.fieldValues) prev.fieldValues = new Map<string, string>();
      prev.fieldValues = prev.fieldValues.set(field.name, value.toString());
      return prev;
    });
  }

  function getFieldValue(field: string) {
    return changeClient.fieldValues?.get(field);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="secondary">
          <IonButtons slot="start">
            <IonButton
              color="medium"
              onClick={(e) => onDismiss(null, "cancel")}
            >
              Cancelar
            </IonButton>
          </IonButtons>
          <IonTitle>{`${
            client === null ? "Adicionar" : "Editar"
          } Cliente do Tipo ${configuration.name}`}</IonTitle>
          <IonButtons slot="end">
            <IonButton
              color="success"
              fill="clear"
              onClick={(e) =>
                onDismiss(changeClient, client == null ? "add" : "edit")
              }
            >
              Salvar
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {configuration.fieldConfigurations.map((field) => (
          <ClientForm
            key={field.name}
            selectedField={field}
            getFieldValue={getFieldValue}
            setFieldValue={setFieldValue}
          />
        ))}
      </IonContent>
    </IonPage>
  );
};
