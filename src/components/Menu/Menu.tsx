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
  IonImg
} from "@ionic/react";

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { useMenuContext } from "../../context/MenuContext";
import { AppPage, UserRole } from "../../types/app.types";
import { additionalPages } from "../../types/pages";
import "./Menu.css";

const Menu: React.FC = () => {
  const [pages, setPages] = useState<AppPage[]>(additionalPages);
  const [activeModules, setActiveModules] = useState<AppPage[]>([]);

  const location = useLocation();
  const { modules } = useMenuContext();
  const { user } = useAuthContext();

  useEffect(() => {
    setPages(additionalPages);

    if (!user) setActiveModules([]);
    else {
      const activeModules = modules.filter((module) => {
        return (
          user.organization.licensing.availableModules.modules.some(
            (m) => m.moduleName == module.id
          ) ||
          module.id === "home" ||
          ((user.user.userRole === UserRole.Admin ||
            user.user.userRole === UserRole.SysAdmin) &&
            module.id === "Configuracoes") ||
          ((user.user.userRole === UserRole.Admin ||
            user.user.userRole === UserRole.SysAdmin) &&
            module.id === "Users")
        );
      });

      setActiveModules(activeModules);
    }

  }, [user]);

  return (
    <IonMenu contentId="main" type="push">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>{user?.organization.name ? (
            <IonImg style={{height: "15rem", color: "#fff"}} src={user.organization.logo} />
          ) : "Cólera CRM"}</IonListHeader>
          <IonNote style={{textAlign: "center", marginTop: "2rem"}}>Powered By Cólera CRM</IonNote>
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
                  detail={true}
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
        {/* <IonList id="additional-list">
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
        </IonList> */}
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
