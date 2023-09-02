import {
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

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { useMenuContext } from "../context/MenuContext";
import { AppPage } from "../types/app.types";
import { additionalPages, authenticationPages } from "../types/pages";
import "./Menu.css";

const Menu: React.FC = () => {
  const [pages, setPages] = useState<AppPage[]>(additionalPages);
  const [activeModules, setActiveModules] = useState<AppPage[]>([]);

  const location = useLocation();
  const { modules } = useMenuContext();
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user) setPages([...authenticationPages]);
    else setPages(additionalPages);

    if (!user) setActiveModules([]);
    else {
      const activeModules = modules.filter((module) => {
        console.log(module.id);
        console.log(user.modules);
        return user.modules.includes(module.id);
      });

      console.log(activeModules);
      setActiveModules(activeModules);
    }
  }, [user]);

  return (
    <IonMenu contentId="main" type="push">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>{user?.name ?? "BrCRM Solutions"}</IonListHeader>
          <IonNote>Powered By BrCRM</IonNote>
          {activeModules.map((appPage, index) => {
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
          {pages.map((appPage, index) => {
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
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
