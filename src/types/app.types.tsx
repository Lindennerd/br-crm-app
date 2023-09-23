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
  id: string;
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
  clientTypeId: string;
  fieldsFilter: { [key: string]: string };
  orderBy: OrderBy | null;
  exact: boolean;
};

export type OrderBy = {
  fieldName: string;
};
export type ClientField = {
  fieldValues: { [key: string]: string }
};

export type Client = {
  id: string;
  clientType: string;
  fieldValues: Map<string, string>;
};

export type ClientNew = {
  id: string | null;
  clientTypeId: string;
  fieldValues: { [key: string]: string };
  clientConfiguration: ClientConfiguration;
};



export type Process = {
  id: string;
  title: string;
  description: string;
  clientId: string;
  client: Client[];
  additionalData: Map<string, string>;
  StartedAt: Date;
  FinishedAt: Date;
  sla: number;
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
  tasks: ProcessTask[];
}

export type ProcessTask = {
  id: string | null;
  title: string;
  createdAt: Date;
  completedAt: Date | null;
  isCompleted: boolean;
}

export type ProcessEvent = {
  id: string | null;
  description: string;
  createdAt: Date;
  eventType: ProcessStatus;
}

export type ProcessComment = {
  id: string | null;
  comment: string;
  createdAt: Date;
  authorId: string;
  authorName: string;
}

export enum ProcessStatus {
  InProgress = 2,
  Waiting = 3,
  Blocked = 4,
  Done = 5
}

export const ProcessStatusText = new Map<ProcessStatus, string>([
  [ProcessStatus.InProgress, "Em progresso"],
  [ProcessStatus.Waiting, "Aguardando"],
  [ProcessStatus.Blocked, "Bloqueado"],
  [ProcessStatus.Done, "Concluído"],
]);

export type ProcessFilter = {
  page: number;
  pageSize: number;
  clientName: string | null;
  clientId: string | null;
  title: string | null;
  createdAt: Date | null;
  finishedAt: Date | null;
  processStatus: ProcessStatus | null;
  isDelayed: boolean | null;
  isAlmostDelayed: boolean | null;
}

export type ProcessConfiguration = {
  id: string;
  title: string;
  description: string;
  sla: number;
  executor: string;
  tasks: ProcessTask[];
  additionalData: Map<string, string>;
}

export type BussinessError = {
  type: string,
  title: string,
  status: number,
  traceId: string
}
