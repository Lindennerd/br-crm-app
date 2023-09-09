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
  id: string | null;
  name: string;
  fieldConfigurations: FieldConfiguration[];
};

export type FieldConfiguration = {
  name: string;
  type: number;
  defaultValue: string | null;
  possibleValues: string[] | null;
};

export enum FieldType {
  Text,
  Number,
  Date,
}

export type GetClientsRequest = {
  page: number;
  pageSize: number;
  clientType: string;
  fieldsFilter: FieldsFilter[] | null;
  orderBy: OrderBy | null;
};

export type OrderBy = {
  fieldName: string;
};
export type ClientField = {
  value: string | number;
  field: FieldConfiguration;
};

export type Client = {
  id: string;
  clientType: string;
  fieldValues: ClientField[];
};

export type FieldsFilter = {
  fieldName: string;
  fieldValue: string | number;
};
