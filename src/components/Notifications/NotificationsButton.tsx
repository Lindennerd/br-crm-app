import { IonButton } from "@ionic/react";
import { useGetNotifications } from "../../api/useNotificationApi";

export const NotificationsButton = () => {
  const { data: notifications } = useGetNotifications();

  return <IonButton>Notificações ({notifications?.length})</IonButton>;
};
