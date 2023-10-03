import { IonButton, IonIcon, IonInput, IonItem } from "@ionic/react";
import { ellipsisHorizontalSharp, personSharp } from "ionicons/icons";
import { useLogin } from "../../api/useLoginApi";
import { useRouter } from "../../common/useRouter";

type LoginFormTargetType = EventTarget & {
  user: { value: string };
  password: { value: string };
};

export const LoginForm = () => {
  const { gotoHome } = useRouter();
  const { mutateAsync: login, error } = useLogin();

  async function handleLoginSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    await login({
      user: (e.target as LoginFormTargetType).user.value,
      password: (e.target as LoginFormTargetType).password.value,
    });
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
        <IonIcon icon={ellipsisHorizontalSharp} slot="end" />
        <IonInput
          name="password"
          label="SENHA"
          type="password"
          labelPlacement="floating"
        ></IonInput>
      </IonItem>
      <IonItem lines="none">
        <IonButton size="default" type="submit">
          LOGIN
        </IonButton>
      </IonItem>
    </form>
  );
};
