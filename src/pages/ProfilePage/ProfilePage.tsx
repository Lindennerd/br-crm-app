import { IonButton, IonToolbar, useIonModal } from "@ionic/react";
import { ChangePasswordModal } from "../../components/Profile/ChangePasswordModal";
import { ProfileForm } from "../../components/Profile/ProfileForm";

export const ProfilePage = () => {
  const [presentChangePasswordModal, dismissChangePasswordModal] = useIonModal(
    ChangePasswordModal,
    {
      onDismiss: () => dismissChangePasswordModal(),
    }
  );

  return (
    <div>
      <IonToolbar color="secondary" style={{ padding: "0 1rem 0 1rem" }}>
        <IonButton
          slot="end"
          fill="solid"
          onClick={(e) =>
            presentChangePasswordModal({
              keyboardClose: false,
              backdropDismiss: false,
            })
          }
        >
          Alterar Senha
        </IonButton>
      </IonToolbar>
      <ProfileForm />
    </div>
  );
};
