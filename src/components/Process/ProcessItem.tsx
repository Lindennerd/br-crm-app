import { IonIcon, IonItem, IonLabel } from "@ionic/react";
import { documentAttachOutline } from "ionicons/icons";
import { useMapUtils } from "../../api/useMapUtils";
import { useRouter } from "../../common/useRouter";
import { Process } from "../../types/app.types";
import { ProcessStatusBadge } from "./ProcessStatusBadge";

export interface IProcessItemProps {
  process: Process;
}

export const ProcessItem = (props: IProcessItemProps) => {
  const { getFirstValue } = useMapUtils();

  const { gotoProcess } = useRouter();

  function handleGoToProcess() {
    gotoProcess(props.process.id);
  }

  return (
    <IonItem onClick={() => handleGoToProcess()} lines="full" detail button>
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
        <h2>
          {props.process.client && getFirstValue(props.process.client[0])}
        </h2>
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
    </IonItem>
  );
};
