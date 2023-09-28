import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonToolbar,
  useIonModal,
} from "@ionic/react";
import { caretBackOutline, documentAttachSharp } from "ionicons/icons";
import { useClient } from "../../common/useClient";
import { Client, Process } from "../../types/app.types";
import {
  ChangeProcessModal,
  ChangeProcessModalProps,
} from "../Process/ChangeProcessModal";

export interface ClientDetailsModalProps {
  onDismiss: () => void;
  client: Client;
}

export const ClientDetailsModal = (props: ClientDetailsModalProps) => {
  const { displayFields, inferConfigurationFromClient } = useClient();

  const emptyProcess: Partial<Process> = {
    client: [props.client],
    clientId: props.client?.id ?? "",
  };

  const [presentChangeProcessModal, dismissChangeProcessModal] = useIonModal(
    ChangeProcessModal,
    {
      process: emptyProcess as Process,
      onDismiss: (data, action) => {
        dismissChangeProcessModal();
      },
    } satisfies ChangeProcessModalProps
  );

  function getClientFields() {
    const configuration =
      props.client?.clientConfiguration?.fieldConfigurations ??
      inferConfigurationFromClient(props.client);
    return displayFields(props.client, configuration);
  }

  function handleNewProcess() {
    presentChangeProcessModal({
      keyboardClose: false,
      backdropDismiss: false,
    });
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="secondary">
          <IonButton
            fill="clear"
            color="medium"
            onClick={(e) => props.onDismiss()}
          >
            <IonIcon icon={caretBackOutline}></IonIcon>
          </IonButton>
          <IonButton
            slot="end"
            style={{ marginRight: "1rem" }}
            onClick={(e) => handleNewProcess()}
          >
            <IonIcon icon={documentAttachSharp} />
            <IonLabel>Novo Processo</IonLabel>
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList lines="full">
          {props.client &&
            getClientFields().map((field, index) => (
              <IonItem key={index}>
                <IonLabel>{field}</IonLabel>
              </IonItem>
            ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};
