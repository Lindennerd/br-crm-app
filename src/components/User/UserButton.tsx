import { menuController } from "@ionic/core/components";
import { IonButton, IonIcon } from "@ionic/react";
import { personCircleSharp } from "ionicons/icons";
import { useAuthContext } from "../../context/AuthContext";

export const UserButton = () => {
  const { user } = useAuthContext();

  async function handleOpenUserMenu() {
    await menuController.enable(true, "user-menu");
    await menuController.toggle("user-menu");
  }

  return (
    <IonButton onClick={handleOpenUserMenu}>
      {user?.name}
      <IonIcon size="large" icon={personCircleSharp} slot="end" />
    </IonButton>
  );
};
