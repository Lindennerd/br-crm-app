import {
  addCircleOutline,
  addCircleSharp,
  businessOutline,
  businessSharp,
  cashOutline,
  cashSharp,
  logInOutline,
  logInSharp,
  personOutline,
  personSharp,
  settingsOutline,
  settingsSharp,
} from "ionicons/icons";
import { ConfigurationPage } from "../pages/Configuration/ConfigurationPage";
import { LoginPage } from "../pages/LoginPage/LoginPage";
import { LogoutPage } from "../pages/LoginPage/LogoutPage";
import { AppPage } from "./app.types";

export const additionalPages: AppPage[] = [
  {
    id: "Configuracoes",
    title: "Configurações",
    url: "/page/Configuracoes",
    iosIcon: settingsOutline,
    mdIcon: settingsSharp,
    page: <ConfigurationPage />,
  },
  {
    id: "Users",
    title: "Usuários",
    url: "/page/users",
    iosIcon: personOutline,
    mdIcon: personSharp,
    page: null,
  },
  {
    id: "logout",
    title: "Logout",
    url: "/page/logout",
    iosIcon: personOutline,
    mdIcon: personSharp,
    page: <LogoutPage />,
  },
];

export const authenticationPages: AppPage[] = [
  {
    id: "login",
    title: "Login",
    url: "/page/login",
    iosIcon: logInOutline,
    mdIcon: logInSharp,
    page: <LoginPage />,
  },
  {
    id: "Register",
    title: "Criar Conta",
    url: "/page/register",
    iosIcon: addCircleOutline,
    mdIcon: addCircleSharp,
    page: undefined,
  },
];

export const appPages: AppPage[] = [
  {
    title: "Clientes",
    id: "ClientManagement",
    url: "/page/Clientes",
    iosIcon: businessOutline,
    mdIcon: businessSharp,
    page: undefined,
  },
  {
    title: "Financeiro",
    id: "FinancialManagement",
    url: "/page/Financeiro",
    iosIcon: cashOutline,
    mdIcon: cashSharp,
    page: undefined,
  },
];
