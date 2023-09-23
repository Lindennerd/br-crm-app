import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonList,
  IonPage,
  IonToolbar,
} from "@ionic/react";
import { caretBackOutline } from "ionicons/icons";
import { Client } from "../../types/app.types";

export interface ClientDetailsModalProps {
  onDismiss: () => void;
  client: Client;
}

export const ClientDetailsModal = (props: ClientDetailsModalProps) => {
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
        <IonList>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

