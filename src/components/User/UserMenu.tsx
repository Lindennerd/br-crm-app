import { menuController } from "@ionic/core/components";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { close, logOutSharp, personCircleSharp } from "ionicons/icons";
import { useEffect } from "react";
import { useRouter } from "../../common/useRouter";
import { useAuthContext } from "../../context/AuthContext";
import "./UserMenu.css";

export const UserMenu = () => {
  const { user, logout } = useAuthContext();
  const { gotoProfile, gotoLogin } = useRouter();

  useEffect(() => {
    menuController.enable(false, "user-menu");
  });

  const handleLogout = () => {
    logout();
    gotoLogin();
  };

  const handleCloseMenu = async () => {
    await menuController.enable(false, "user-menu");
    await menuController.toggle("user-menu");
  };
  return (
    <IonMenu side="end" contentId="main" type="overlay" menuId="user-menu">
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Usuário</IonTitle>
          <IonButton
            slot="start"
            fill="clear"
            color="light"
            onClick={() => handleCloseMenu()}
          >
            <IonIcon icon={close} />
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList id="menu-options" lines="none">
          <IonItem button onClick={(e) => gotoProfile()}>
            <IonLabel>Perfil</IonLabel>
            <IonIcon slot="end" icon={personCircleSharp} />
          </IonItem>
          <IonItem onClick={() => handleLogout()} button>
            <IonLabel>Sair</IonLabel>
            <IonIcon slot="end" icon={logOutSharp} />
          </IonItem>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};
