import {
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  useIonAlert,
  useIonLoading,
} from "@ionic/react";
import { useRouter } from "../../common/useRouter";
import { useAuthContext } from "../../context/AuthContext";
import { ellipseSharp, ellipsisHorizontalSharp, personSharp } from "ionicons/icons";

type LoginFormTargetType = EventTarget & {
  user: { value: string };
  password: { value: string };
};

export const LoginForm = () => {
  const { gotoHome } = useRouter();
  const authContext = useAuthContext();
  const [present, dismiss] = useIonLoading();
  const [presentAlert] = useIonAlert();

  async function handleLoginSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    try {
      const target = e.target as LoginFormTargetType;
      await present("Por favor, aguarde");
      const result = await authContext.login(
        target.user.value,
        target.password.value
      );
      await dismiss();
      gotoHome();

      if (!result.success)
        presentAlert("O usuário ou a senha estão incorretos");
    } catch (error) {
      dismiss();
      presentAlert((error as Error).message);
    }
  }

  return (
    <form
      onSubmit={(e) => handleLoginSubmit(e)}
      method="POST"
      style={{ width: 300 }}
    >
      <IonItem>
        <IonIcon icon={personSharp} slot="end" />
        <IonInput
          name="user"
          label="USUÁRIO"
          type="text"
          labelPlacement="floating"
        ></IonInput>
      </IonItem>
      <IonItem>
        <IonIcon  icon={ellipsisHorizontalSharp} slot="end"/>
        <IonInput
          name="password"
          label="SENHA"
          type="password"
          labelPlacement="floating"
        ></IonInput>
      </IonItem>
      <IonItem lines="none">
        <IonButton size="default" type="submit">LOGIN</IonButton>
      </IonItem>
    </form>
  );
};
