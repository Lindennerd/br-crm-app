import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from "@ionic/react";

import {
  businessOutline,
  businessSharp,
  cashOutline,
  cashSharp,
  homeOutline,
  homeSharp,
  personOutline,
  personSharp,
  settingsOutline,
  settingsSharp,
} from "ionicons/icons";
import { useLocation } from "react-router-dom";
import "./Menu.css";

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: "Inicio",
    url: "/page/Inicio",
    iosIcon: homeOutline,
    mdIcon: homeSharp,
  },
  {
    title: "Clientes",
    url: "/page/Clientes",
    iosIcon: businessOutline,
    mdIcon: businessSharp,
  },
  {
    title: "Financeiro",
    url: "/page/Financeiro",
    iosIcon: cashOutline,
    mdIcon: cashSharp,
  },
];

const additionalPages: AppPage[] = [
  {
    title: "Configurações",
    url: "/page/Configuracoes",
    iosIcon: settingsOutline,
    mdIcon: settingsSharp,
  },
  {
    title: "Usuários",
    url: "/page/users",
    iosIcon: personOutline,
    mdIcon: personSharp,
  },
];

const labels = ["Family", "Friends", "Notes", "Work", "Travel", "Reminders"];

const Menu: React.FC = () => {
  const location = useLocation();

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>Company Name</IonListHeader>
          <IonNote>Powered By BrCRM</IonNote>
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem
                  className={
                    location.pathname === appPage.url ? "selected" : ""
                  }
                  routerLink={appPage.url}
                  routerDirection="none"
                  lines="none"
                  detail={false}
                >
                  <IonIcon
                    aria-hidden="true"
                    slot="start"
                    ios={appPage.iosIcon}
                    md={appPage.mdIcon}
                  />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>
        <IonList id="additional-list">
          {additionalPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem
                  className={
                    location.pathname === appPage.url ? "selected" : ""
                  }
                  routerLink={appPage.url}
                  routerDirection="none"
                  lines="none"
                  detail={false}
                >
                  <IonIcon
                    aria-hidden="true"
                    slot="start"
                    ios={appPage.iosIcon}
                    md={appPage.mdIcon}
                  />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>
        <IonButton fill="outline">Logout</IonButton>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
