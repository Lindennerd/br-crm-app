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
import { useEffect, useState } from "react";
import { useMapUtils } from "../../api/useMapUtils";

export interface ClientDetailsModalProps {
  onDismiss: () => void;
  client: Client;
}

export const ClientDetailsModal = (props: ClientDetailsModalProps) => {
  const [client, setClient] = useState(props.client);
  const {objectToMap} = useMapUtils()

  useEffect(() => {
    setClient({
      ...props.client,
      fieldValues: objectToMap(props.client?.fieldValues),
    });
  }, [props.client]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
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
