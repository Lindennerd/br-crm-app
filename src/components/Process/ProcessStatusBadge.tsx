import { IonBadge } from "@ionic/react";
import { useProcessPageController } from "../../pages/ProcessPage/ProcessPage.Controller";
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
  const { getStatusDescription } = useProcessPageController();

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
