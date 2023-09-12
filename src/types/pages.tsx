import {
  addCircleOutline,
  addCircleSharp,
  businessOutline,
  businessSharp,
  cashOutline,
  cashSharp,
  homeOutline,
  homeSharp,
  logInOutline,
  logInSharp,
  personOutline,
  personSharp,
  rocketOutline,
  rocketSharp,
  settingsOutline,
  settingsSharp,
} from "ionicons/icons";
import { ClientsPage } from "../pages/ClientsPage/ClientsPage";
import { ConfigurationPage } from "../pages/Configuration/ConfigurationPage";
import { HomePage } from "../pages/Home/HomePage";
import { LoginPage } from "../pages/LoginPage/LoginPage";
import { AppPage } from "./app.types";
import { ProcessPage } from "../pages/ProcessPage/ProcessPage";

export const additionalPages: AppPage[] = [];

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

export const modulePages: AppPage[] = [
  {
    title: "Início",
    id: "home",
    url: "/page/home",
    iosIcon: homeOutline,
    mdIcon: homeSharp,
    page: <HomePage />,
  },
  {
    title: "Clientes",
    id: "ClientManagement",
    url: "/page/ClientManagement",
    iosIcon: businessOutline,
    mdIcon: businessSharp,
    page: <ClientsPage />,
  },
  {
    title: "Financeiro",
    id: "FinancialManagement",
    url: "/page/Financeiro",
    iosIcon: cashOutline,
    mdIcon: cashSharp,
    page: undefined,
  },
  {
    title: "Processos",
    id: "ProcessManagement",
    url: "/page/ProcessManagement",
    iosIcon: rocketOutline,
    mdIcon: rocketSharp,
    page: <ProcessPage />,
  },
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
];
