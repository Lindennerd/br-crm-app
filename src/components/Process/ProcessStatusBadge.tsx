import { IonBadge } from "@ionic/react";
import { ProcessStatus } from "../../types/app.types";

export const ProcessStatusBadge = ({
  status,
  slot,
  style,
}: {
  status: ProcessStatus;
  slot?: string | null;
  style?: { [key: string]: string } | null;
}) => {
  function getStatusDescription(status: ProcessStatus) {
    switch (status) {
      case ProcessStatus.Blocked:
        return "Bloqueado";
      case ProcessStatus.Done:
        return "Finalizado";
      case ProcessStatus.InProgress:
        return "Em Análise";
      case ProcessStatus.Waiting:
        return "Pendente";
      default:
        return "";
    }
  }

  return (
    <IonBadge
      style={style ?? {}}
      slot={slot ?? ""}
      color={
        status === ProcessStatus.Done
          ? "success"
          : status === ProcessStatus.Blocked
          ? "danger"
          : status === ProcessStatus.InProgress
          ? "warning"
          : "medium"
      }
    >
      {getStatusDescription(status)}
    </IonBadge>
  );
};
