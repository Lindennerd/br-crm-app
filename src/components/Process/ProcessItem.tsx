import {
  IonButton,
  IonButtons,
  IonIcon,
  IonItem,
  IonLabel,
} from "@ionic/react";
import { Process } from "../../types/app.types";
import { useMapUtils } from "../../api/useMapUtils";
import {
  documentAttachOutline,
  flashSharp,
} from "ionicons/icons";
import { ProcessStatusBadge } from "./ProcessStatusBadge";

export interface IProcessItemProps {
  process: Process;
  onSelectProcess: (process: Process) => void;
  onViewEvents: (process: Process) => void;
  onViewTasks: (process: Process) => void;
}

export const ProcessItem = (props: IProcessItemProps) => {
  const { getFirstValue } = useMapUtils();

  return (

    <IonItem lines="full" detail button onClick={e => props.onSelectProcess(props.process)}>
      <IonIcon icon={documentAttachOutline} slot="start" size="large" />

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
        <h2>{props.process.client && getFirstValue(props.process.client[0])}</h2>
        <div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
          <p>
            Criado em: {new Date(props.process.createdAt).toLocaleDateString()}
          </p>
          <p>Prazo de {props.process.sla} dias</p>
        </div>
      </IonLabel>
      <div>
        <div style={{ display: "flex", flexDirection: "column", gap: ".2rem" }}>
          <ProcessStatusBadge status={props.process.status} />
        </div>
      </div>
      {/* <IonButtons
        slot="end"
        style={{ display: "flex", flexDirection: "column", gap: ".2rem" }}
      >
        <IonButton fill="solid" color="tertiary">
          Eventos ({props.process.events?.length})
        </IonButton>
        <IonButton fill="solid" color="tertiary">
          Tarefas a fazer ({props.process.tasks?.length})
        </IonButton>
      </IonButtons> */}
    </IonItem>
  );
};
