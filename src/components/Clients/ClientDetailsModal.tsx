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

export const ClientDetailsModal = ({
  onDismiss,
  client,
}: {
  onDismiss: () => void;
  client: Client;
}) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButton fill="clear" color="medium" onClick={(e) => onDismiss()}>
            <IonIcon icon={caretBackOutline}></IonIcon>
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          {client?.fieldValues.map((fieldValue, index) => (
            <IonItem key={`${fieldValue.field.name}_${index}`}>
              <IonLabel>
                {fieldValue.field.name}: {fieldValue.value}
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};
