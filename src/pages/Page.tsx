import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonMenuButton,
  IonPage,
  IonProgressBar,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { logOutOutline, personCircleSharp, rocketSharp } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import { useRouter } from "../common/useRouter";
import ExploreContainer from "../components/ExploreContainer/ExploreContainer";
import { UserButton } from "../components/User/UserButton";
import { useAuthContext } from "../context/AuthContext";
import { useLoadingContext } from "../context/LoadingContext";
import { AppPage } from "../types/app.types";
import {
  additionalPages,
  authenticationPages,
  modulePages,
} from "../types/pages";
import "./Page.css";
import { ProcessDetailsPage } from "./ProcessPage/ProcessDetailsPage";
import { ProfilePage } from "./ProfilePage/ProfilePage";

const Page = () => {
  const { gotoHome, gotoLogin } = useRouter();
  const { user, logout } = useAuthContext();
  const location = useLocation();
  const { name } = useParams<{ name: string }>();
  const [page, setPage] = useState<AppPage>();

  const { loading } = useLoadingContext();

  useEffect(() => {
    const page = additionalPages.find((page) => page.id === name);
    if (page) return setPage(page);
    const authPage = authenticationPages.find((page) => page.id === name);
    if (authPage) return setPage(authPage);
    const appPage = modulePages.find((page) => page.id === name);
    if (appPage) return setPage(appPage);
    if (location.pathname.includes("processo")) {
      setPage({
        title: "Detalhes do Processo",
        id: "ProcessManagement",
        iosIcon: rocketSharp,
        mdIcon: rocketSharp,
        url: location.pathname,
        page: <ProcessDetailsPage processId={name} />,
      });
    }
    if (location.pathname.includes("profile")) {
      setPage({
        title: "Perfil",
        id: "Profile",
        iosIcon: personCircleSharp,
        mdIcon: personCircleSharp,
        url: location.pathname,
        page: <ProfilePage />,
      });
    }
  }, [name]);

  const handleLogin = () => {
    gotoLogin();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{page?.title}</IonTitle>
          {loading && <IonProgressBar type="indeterminate"></IonProgressBar>}
          <IonButtons slot="end">
            {user ? (
              <UserButton />
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
            <IonButtons slot="start">
              <IonBackButton></IonBackButton>
            </IonButtons>
            <IonTitle size="large">{name}</IonTitle>
          </IonToolbar>
        </IonHeader>
        {page?.page ?? <ExploreContainer name={name} />}
      </IonContent>
    </IonPage>
  );
};

export default Page;
