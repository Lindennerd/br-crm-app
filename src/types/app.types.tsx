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
  user: User;
  token: string;
  name: string;
  organization: Organization;
}

export type User = {
  name: string;
  userName: string;
  userRole: UserRole;
};

export type Organization = {
  name: string;
  logo: string;
  theme: Theme | undefined;
  licensing: Licensing;
};

export type Theme = {
  primary: string;
  secondary: string;
  tertiary: string;
};

export type Licensing = {
  active: boolean;
  availableModules: { modules: Module[] };
};

export type Module = {
  moduleName: string;
};

export type UserLicensing = {
  name: string;
  maxUsers: number;
};

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
  required: boolean;
  order: number;
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
  fieldsFilter: Map<string, string> | null;
  orderBy: OrderBy | null;
  exact: boolean;
};

export type OrderBy = {
  fieldName: string;
};
export type ClientField = {
  value: string;
  field: FieldConfiguration;
};

export type Client = {
  id: string;
  clientType: string;
  fieldValues: Map<string, string>;
};

export type Process = {
  id: string;
  title: string;
  description: string;
  client: string;
  additionalData: Map<string, string>;
  StartedAt: Date;
  FinishedAt: Date;
  SLA: number;
  createdAt: Date;
  updatedAt: Date;
  executor: string;
  deadLine: Date;
  isDelayed: boolean;
  isAlmostDelayed: boolean;
  isBlocked: boolean;
  status: ProcessStatus;
  events: ProcessEvent[];
  comments: ProcessComment[];
}

export type ProcessEvent = {
  id: string;
  description: string;
  createdAt: Date;
  eventType: ProcessStatus;
}

export type ProcessComment = {
  comment: string;
  createdAt: Date;
  author: string;
}

export enum ProcessStatus {
  Started = 0,
  InProgress = 2,
  Waiting = 3,
  Blocked = 4,
  Done = 5
}

export type ProcessFilter = {
  page: number;
  pageSize: number;
  clientId: string;
  processId: string;
  onlyActive: boolean;
}

export type ProcessConfiguration = {
  id: string;
  title: string;
  description: string;
  sla: number;
  executor: string;
  additionalData: Map<string, string>;
}
