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
import { Client, Process } from "../../types/app.types";
import { useEffect, useState } from "react";
import { ChangeProcessModal, ChangeProcessModalProps, changeProcessAtom } from "../Process/ChangeProcessModal";
import { useProcessPageController } from "../../pages/ProcessPage/ProcessPage.Controller";

export interface ClientDetailsModalProps {
  onDismiss: () => void;
  client: Client;
}

export const ClientDetailsModal = (props: ClientDetailsModalProps) => {
  const controller = useProcessPageController();

  const [client, setClient] = useState(props.client);
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);

  const [addProcessModal, dismissAddProcessModal] = useIonModal(
    ChangeProcessModal,
    {
      process: {...selectedProcess, client: client},
      onDismiss: (data, action) => {
        if (action === "add" && data) {
          controller.add(data);
        }
        if (action === "edit" && data) {
          controller.add(data);
        }
        setSelectedProcess(null);
        dismissAddProcessModal();
      },
    } as ChangeProcessModalProps
  );

  useEffect(() => {
    if (props.client)
      setClient({
        ...props.client,
        fieldValues: props.client?.fieldValues,
      });
  }, [props.client]);

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
          <IonButton color="light" fill="clear" slot="end" onClick={e => addProcessModal()}>
            <IonLabel>Novo Processo</IonLabel>
            <IonIcon icon={documentAttachSharp}></IonIcon>
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          {client?.fieldValues &&
            Array.from(client?.fieldValues).map(
              ([fieldName, fieldValue], index) => (
                <IonItem key={fieldName}>
                  <IonLabel>
                    {fieldName}: {fieldValue}
                  </IonLabel>
                </IonItem>
              )
            )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

