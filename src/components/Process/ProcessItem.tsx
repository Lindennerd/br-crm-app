import {
  IonBadge,
  IonButton,
  IonButtons,
  IonIcon,
  IonItem,
  IonLabel,
} from "@ionic/react";
import { Process, ProcessStatus } from "../../types/app.types";
import { useMapUtils } from "../../api/useMapUtils";
import {
  flashSharp,
} from "ionicons/icons";
import { useProcessPageController } from "../../pages/ProcessPage/ProcessPage.Controller";

export interface IProcessItemProps {
  process: Process;
  onSelectProcess: (process: Process) => void;
  onViewEvents: (process: Process) => void;
    onViewTasks: (process: Process) => void;
}

export const ProcessItem = (props: IProcessItemProps) => {
  const { getFirstValue } = useMapUtils();
  const { getStatusDescription } = useProcessPageController();

  return (

    <IonItem lines="full" detail button>
      <IonIcon icon={flashSharp} slot="start" size="large" color="warning" />

      <IonLabel>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "5rem",
          }}
        >
          <h1>{props.process.title}</h1>
        </div>
        <h2>{getFirstValue(props.process.client[0])}</h2>
        <div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
          <p>
            Criado em: {new Date(props.process.createdAt).toLocaleDateString()}
          </p>
          <p>Prazo de {props.process.sla} dias</p>
        </div>
      </IonLabel>
      <div>
        <div style={{ display: "flex", flexDirection: "column", gap: ".2rem" }}>
          <IonBadge>{getStatusDescription(props.process.status)}</IonBadge>
          {props.process.isDelayed && (
            <IonBadge color="danger">Atrasado</IonBadge>
          )}
          {props.process.isAlmostDelayed && (
            <IonBadge color="warning">Quase atrasado</IonBadge>
          )}
          {props.process.isBlocked && (
            <IonBadge color="danger">Bloqueado</IonBadge>
          )}
        </div>
      </div>
      <IonButtons
        slot="end"
        style={{ display: "flex", flexDirection: "column", gap: ".2rem" }}
      >
        <IonButton fill="solid" color="tertiary">
          Eventos ({props.process.events?.length})
        </IonButton>
        <IonButton fill="solid" color="tertiary">
          Tarefas a fazer ({props.process.tasks?.length})
        </IonButton>
      </IonButtons>
    </IonItem>
  );
};
