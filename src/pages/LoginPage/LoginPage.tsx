import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonRow,
} from "@ionic/react";
import { LoginForm } from "../../components/LoginForm/LoginForm";

export const LoginPage = () => {
  return (
    <>
      <IonRow>
        <IonCol
          className="ion-justify-content-center"
          style={{ display: "flex" }}
        >
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Login</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <LoginForm />
            </IonCardContent>
          </IonCard>
        </IonCol>
      </IonRow>
    </>
  );
};
