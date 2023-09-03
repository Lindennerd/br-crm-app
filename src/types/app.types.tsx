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

export type ClientConfiguration = {
  name: string;
  fieldConfigurations: FieldConfiguration[];
};

export type FieldConfiguration = {
  name: string;
  type: number;
  defaultValue: string;
  possibleValues: string[];
};

export enum FieldType {
  Text,
  Number,
  Date,
}
