import {
  IonContent,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
} from "@ionic/react";

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { useMenuContext } from "../../context/MenuContext";
import { AppPage } from "../../types/app.types";
import { additionalPages } from "../../types/pages";
import "./Menu.css";

import { useRouter } from "../../common/useRouter";
import { UserRole } from "../../types";
import BrunaReisLogo from "/BrunaReisLogo.svg";

const Menu: React.FC = () => {
  const { gotoLogin } = useRouter();
  const [pages, setPages] = useState<AppPage[]>(additionalPages);
  const [activeModules, setActiveModules] = useState<AppPage[]>([]);

  const location = useLocation();
  const { modules } = useMenuContext();
  const { user, logout } = useAuthContext();
  useEffect(() => {
    if (!user || !user.organization) {
      // logout();
      // gotoLogin();
    }

    setPages(additionalPages);

    if (!user) setActiveModules([]);
    else {
      const activeModules = modules.filter((module) => {
        return (
          user.organization.licensing.availableModules.modules.some(
            (m) => m.moduleName == module.id
          ) ||
          module.id === "home" ||
          ((user.userRole === UserRole.Admin ||
            user.userRole === UserRole.SysAdmin) &&
            module.id === "Configuracoes") ||
          ((user.userRole === UserRole.Admin ||
            user.userRole === UserRole.SysAdmin) &&
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
          <IonListHeader>
            {user?.organization.name ? (
              <IonImg
                style={{ height: "15rem", color: "#fff" }}
                src={user.organization.logo}
              />
            ) : (
              <IonImg
                style={{ height: "15rem", color: "#fff" }}
                src={BrunaReisLogo}
              />
            )}
          </IonListHeader>
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
        <div className="footer">&trade; Powered By Cólera CRM &copy; 2023</div>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
