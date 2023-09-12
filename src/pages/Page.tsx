import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { logOutOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useRouter } from "../common/useRouter";
import ExploreContainer from "../components/ExploreContainer/ExploreContainer";
import { useAuthContext } from "../context/AuthContext";
import { AppPage } from "../types/app.types";
import {
  additionalPages,
  authenticationPages,
  modulePages,
} from "../types/pages";
import "./Page.css";

const Page = () => {
  const { gotoHome, gotoLogin } = useRouter();
  const { user, logout } = useAuthContext();
  const { name } = useParams<{ name: string }>();
  const [page, setPage] = useState<AppPage>();

  useEffect(() => {
    const page = additionalPages.find((page) => page.id === name);
    if (page) return setPage(page);
    const authPage = authenticationPages.find((page) => page.id === name);
    if (authPage) return setPage(authPage);
    const appPage = modulePages.find((page) => page.id === name);
    if (appPage) return setPage(appPage);
  }, [name]);

  const handleLogout = () => {
    logout();
    gotoHome();
  };

  const handleLogin = () => {
    gotoLogin();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{page?.title}</IonTitle>
          <IonButtons slot="end">
            {user ? (
              <IonButton
                onClick={() => handleLogout()}
                size="default"
                fill="clear"
              >
                <IonIcon
                  slot="end"
                  ios={logOutOutline}
                  md={logOutOutline}
                ></IonIcon>
                <IonLabel>Logout</IonLabel>
              </IonButton>
            ) : (
              <IonButton
                onClick={() => handleLogin()}
                size="default"
                fill="clear"
              >
                <IonIcon
                  slot="end"
                  ios={logOutOutline}
                  md={logOutOutline}
                ></IonIcon>
                <IonLabel>Login</IonLabel>
              </IonButton>
            )}
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{name}</IonTitle>
          </IonToolbar>
        </IonHeader>
        {page?.page ?? <ExploreContainer name={name} />}
      </IonContent>
    </IonPage>
  );
};

export default Page;
