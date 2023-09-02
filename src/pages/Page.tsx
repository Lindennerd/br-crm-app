import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import ExploreContainer from "../components/ExploreContainer";
import { useAuthContext } from "../context/AuthContext";
import { AppPage } from "../types/app.types";
import { additionalPages, appPages, authenticationPages } from "../types/pages";
import "./Page.css";

const Page = () => {
  const { user } = useAuthContext();
  const { name } = useParams<{ name: string }>();
  const [page, setPage] = useState<AppPage>();

  useEffect(() => {
    const page = additionalPages.find((page) => page.id === name);
    if (page) return setPage(page);
    const authPage = authenticationPages.find((page) => page.id === name);
    if (authPage) return setPage(authPage);
    const appPage = appPages.find((page) => page.id === name);
    if (appPage) return setPage(appPage);
  }, [name]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{page?.title}</IonTitle>
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
