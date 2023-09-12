import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonTitle,
  IonContent,
} from "@ionic/react";
import { closeSharp } from "ionicons/icons";
import { useState } from "react";

export type ProcessFilterProps = {
  onDismiss: (data: any | null, action: "add" | "remove" | "cancel") => void;
  filters: [];
};

export const ProcessFilter = (props: ProcessFilterProps) => {
  const [filters, setFilters] = useState<[]>(props.filters ?? []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton
              color="medium"
              onClick={(e) => props.onDismiss(null, "cancel")}
            >
              <IonIcon icon={closeSharp}></IonIcon>
            </IonButton>
          </IonButtons>
          <IonTitle>Filtrar Processos</IonTitle>
          <IonButtons slot="end">
            <IonButton
              color="success"
              fill="clear"
              onClick={(e) =>
                props.onDismiss(filters, filters.length == 0 ? "add" : "remove")
              }
            >
              Salvar
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding">
        <p>Aqui vai o form</p>
      </IonContent>
    </IonPage>
  );
};
