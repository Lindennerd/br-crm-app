import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useRef } from "react";

export const ClientTypeModal = ({
  onDismiss,
}: {
  onDismiss: (data?: string | null | undefined | number, role?: string) => void;
}) => {
  const clientTypeNameRef = useRef<HTMLIonInputElement>(null);

  return (
    <>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton
                color="medium"
                onClick={(e) => onDismiss(null, "cancel")}
              >
                Cancelar
              </IonButton>
            </IonButtons>
            <IonTitle>Adicionar Tipo de Cliente</IonTitle>
            <IonButtons slot="end">
              <IonButton
                color="primary"
                onClick={(e) =>
                  onDismiss(clientTypeNameRef.current?.value, "save")
                }
              >
                Salvar
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonInput
            ref={clientTypeNameRef}
            label="Nome do Tipo de Cliente"
            labelPlacement="stacked"
          />
        </IonContent>
      </IonPage>
    </>
  );
};
