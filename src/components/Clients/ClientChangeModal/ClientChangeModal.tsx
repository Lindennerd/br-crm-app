import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonModal,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonToast,
} from "@ionic/react";
import { ClientConfiguration, ClientNew } from "../../../types/app.types";
import { ClientForm } from "../ClientForm";
import { useQueryClient } from "react-query";
import { useEffect, useState } from "react";
import { useSaveClient } from "../../../api/useClientApi";

export type ClientChangeAction = "add" | "edit" | "cancel";
export type ClientChangeModalParams = {
  onDismiss: () => void;
  client: ClientNew | null;
  clientConfiguration: ClientConfiguration | null;
};

export const ClientChangeModal = (props: ClientChangeModalParams) => {
  const [presentToast] = useIonToast();
  const [client, setClient] = useState<ClientNew | null>(props.client);
  const clientMutation = useSaveClient();

  function getTitleText() {
    if (!props.client && props.clientConfiguration)
      return `Adicionar cliente do tipo ${props.clientConfiguration.name}`;
    if (props.client)
      return `Editar cliente ${
        props.client.fieldValues[
          props.client.clientConfiguration.fieldConfigurations[0].name
        ]
      }`;
    if (!props.client && !props.clientConfiguration)
      throw new Error(
        "Invalid parameters at <clientchangemodal>. Both parameters are null"
      );
  }

  function renderClientForm() {
    if (props.client)
      return <ClientForm setClient={setClient} client={client} />;
    if (props.clientConfiguration)
      return (
        <ClientForm
          setClient={setClient}
          client={client}
          clientConfiguration={props.clientConfiguration}
        />
      );
    throw new Error(
      "Invalid parameters at <clientchangemodal>. Both parameters are null"
    );
  }

  function save() {
    if (!client) return;
    const validationMessages = validateFields(client);
    if (validationMessages.length > 0) {
      presentToast({
        message: validationMessages.join("\r\n"),
        duration: 3000,
        color: "warning",
        position: "top",
      });
      return;
    } else {
      clientMutation.mutate(client, {
        onSuccess: () => {
          setClient(null);
          props.onDismiss();
        }
      });
    }
  }

  function validateFields(client: ClientNew) {
    return client.clientConfiguration.fieldConfigurations
      .map((field) => {
        if (field.required && (!client.fieldValues[field.name] || client.fieldValues[field.name] === ""))
          return `${field.name} é obrigatório`;
        return "";
      })
      .filter((message) => message !== "");
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="secondary">
          <IonButtons slot="start">
            <IonButton color="medium" onClick={(e) => props.onDismiss()}>
              Cancelar
            </IonButton>
          </IonButtons>
          <IonTitle>{getTitleText()}</IonTitle>
          <IonButtons slot="end">
            <IonButton
              color="success"
              fill="clear"
              onClick={(e) => save()}
            >
              Salvar
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">{renderClientForm()}</IonContent>
    </IonPage>
  );
};
