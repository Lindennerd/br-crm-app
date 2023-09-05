import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
} from "@ionic/react";
import { LoginForm } from "../../components/LoginForm/LoginForm";

export const LoginPage = () => {
  return (
    <div style={{ display: "flex" }} className="ion-justify-content-center">
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Login</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <LoginForm />
        </IonCardContent>
      </IonCard>
    </div>
  );
};
