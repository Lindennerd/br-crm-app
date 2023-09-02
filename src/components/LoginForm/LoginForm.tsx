import { IonButton, IonInput, useIonAlert, useIonLoading } from "@ionic/react";
import { useAuthContext } from "../../context/AuthContext";

type LoginFormTargetType = EventTarget & {
  user: { value: string };
  password: { value: string };
};

export const LoginForm = () => {
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
      <IonInput
        name="user"
        label="USUÁRIO"
        type="text"
        labelPlacement="floating"
      ></IonInput>
      <IonInput
        name="password"
        label="SENHA"
        type="password"
        labelPlacement="floating"
      ></IonInput>
      <IonButton type="submit">LOGIN</IonButton>
    </form>
  );
};
