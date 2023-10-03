import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonToast,
} from "@ionic/react";
import { close } from "ionicons/icons";
import { useState } from "react";
import { useChangePassword } from "../../api/useLoginApi";
import { useAuthContext } from "../../context/AuthContext";

export interface ChangePasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export const ChangePasswordModal = ({
  onDismiss,
}: {
  onDismiss: () => void;
}) => {
  const { logout } = useAuthContext();
  const changePassword = useChangePassword();
  const [presetToast] = useIonToast();
  const [changePasswordForm, setChangePasswordForm] =
    useState<ChangePasswordForm>({
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });

  function handleChangePasswordForm() {
    if (
      changePasswordForm.newPassword !== changePasswordForm.confirmNewPassword
    ) {
      return presetToast({
        message: "As senhas não coincidem",
        duration: 2000,
        color: "warning",
        position: "top",
      });
    }

    changePassword.mutate(
      {
        newPassword: changePasswordForm.newPassword,
        oldPassword: changePasswordForm.oldPassword,
        newPasswordConfirmation: changePasswordForm.confirmNewPassword,
      },
      {
        onSuccess: () => {
          logout();
        },
      }
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="secondary">
          <IonButton
            fill="clear"
            color="light"
            slot="start"
            onClick={() => onDismiss()}
          >
            <IonIcon icon={close} />
          </IonButton>
          <IonTitle>Alterar Senha</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding">
        <IonInput
          type="password"
          label="Senha Atual"
          labelPlacement="floating"
          value={changePasswordForm.oldPassword}
          onIonChange={(e) =>
            setChangePasswordForm({
              ...changePasswordForm,
              oldPassword: e.detail.value!,
            })
          }
        />
        <IonInput
          type="password"
          label="Nova Senha"
          labelPlacement="floating"
          value={changePasswordForm.newPassword}
          onIonChange={(e) =>
            setChangePasswordForm({
              ...changePasswordForm,
              newPassword: e.detail.value!,
            })
          }
        />
        <IonInput
          type="password"
          label="Confirmar Nova Senha"
          labelPlacement="floating"
          value={changePasswordForm.confirmNewPassword}
          onIonChange={(e) =>
            setChangePasswordForm({
              ...changePasswordForm,
              confirmNewPassword: e.detail.value!,
            })
          }
        />
        <IonButton onClick={(e) => handleChangePasswordForm()}>
          Salvar
        </IonButton>
      </IonContent>
    </IonPage>
  );
};
