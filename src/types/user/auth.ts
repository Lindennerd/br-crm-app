import { User } from "./user";

export type Auth = {
  token: string;
  refreshToken: string;
  user: User;
};
