import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonItem,
  IonList,
  IonNote,
  IonTitle,
} from "@ionic/react";
import { Process } from "../../types/app.types";
import { useMapUtils } from "../../api/useMapUtils";
import { ProcessStatusBadge } from "./ProcessStatusBadge";

export const ProcessCard = ({ process }: { process: Process }) => {
  const { getFirstValue } = useMapUtils();

  return (
    <IonCard style={{ width: "100%" }} href={`page/processo/${process.id}`}>
      <IonCardHeader>
        <IonTitle>{process.title}</IonTitle>
        <IonCardSubtitle>{getFirstValue(process.client[0])}</IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>

        <IonNote>Criado em: {new Date(process.createdAt).toLocaleString()}</IonNote>
        <IonNote>Prazo: {process.sla} dias</IonNote>
      </IonCardContent>
      <div style={{padding: "1em"}}>
        <ProcessStatusBadge status={process.status} />
      </div>
    </IonCard>
  );
};
