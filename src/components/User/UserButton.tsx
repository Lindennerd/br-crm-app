import { IonButton, IonContent, IonIcon, IonPopover } from "@ionic/react";
import { personCircleSharp } from "ionicons/icons";
import { useAuthContext } from "../../context/AuthContext";
import { useRouter } from "../../common/useRouter";

export const UserButton = () => {
  const { user, logout } = useAuthContext();
  const { gotoHome, gotoLogin } = useRouter();

  const handleLogout = () => {
    logout();
    gotoLogin();
  };

  return (
    <>
      <IonButton id="user-button">
        {user?.user.name}
        <IonIcon size="large" icon={personCircleSharp} slot="end" />
      </IonButton>
      <IonPopover trigger="user-button" triggerAction="click">
        <IonContent>
          <IonButton fill="clear" style={{width: "100%"}}>Perfil</IonButton>
          <IonButton fill="clear" style={{width: "100%"}} onClick={() => handleLogout()}>Logout</IonButton>
        </IonContent>
      </IonPopover>
    </>
  );
};
