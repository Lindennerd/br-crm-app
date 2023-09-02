import { ReactElement } from "react";

export interface AppPage {
  url: string;
  id: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
  page: ReactElement | null | undefined;
}

export interface UserData {
  user: {
    name: string;
    userName: string;
    userRole: UserRole;
  };
  token: string;
  name: string;
  modules: string[];
}

export enum UserRole {
  SysAdmin,
  User,
  Admin,
}
