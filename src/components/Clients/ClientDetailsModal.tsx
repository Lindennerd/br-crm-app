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
} from "@ionic/react";
import { caretBackOutline } from "ionicons/icons";
import { Client } from "../../types/app.types";
import { useClient } from "../../common/useClient";

export interface ClientDetailsModalProps {
  onDismiss: () => void;
  client: Client;
}

export const ClientDetailsModal = (props: ClientDetailsModalProps) => {
  const {displayFields} = useClient();


  function getClientFields() {
    return displayFields(props.client, props.client?.clientConfiguration.fieldConfigurations)
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
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList lines="full">
          {getClientFields().map((field, index) => (
            <IonItem key={index}>
              <IonLabel>
                {field}
              </IonLabel>
              </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

