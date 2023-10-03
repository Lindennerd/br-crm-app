import { IonButton, IonContent, IonIcon, IonPopover } from "@ionic/react";
import { personCircleSharp } from "ionicons/icons";
import { useRouter } from "../../common/useRouter";
import { useAuthContext } from "../../context/AuthContext";

export const UserButton = () => {
  const { user, logout } = useAuthContext();
  const { gotoProfile, gotoLogin } = useRouter();

  const handleLogout = () => {
    logout();
    gotoLogin();
  };

  return (
    <>
      <IonButton id="user-button">
        {user?.name}
        <IonIcon size="large" icon={personCircleSharp} slot="end" />
      </IonButton>
      <IonPopover trigger="user-button" triggerAction="click">
        <IonContent>
          <IonButton
            fill="clear"
            style={{ width: "100%" }}
            onClick={(e) => gotoProfile()}
          >
            Perfil
          </IonButton>
          <IonButton
            fill="clear"
            style={{ width: "100%" }}
            onClick={() => handleLogout()}
          >
            Logout
          </IonButton>
        </IonContent>
      </IonPopover>
    </>
  );
};
