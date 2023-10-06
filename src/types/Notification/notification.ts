import { User } from "../user/user";

export type Notification = {
  id: string;
  description: string;
  createdById: string;
  targetUserId: string;
  targetUser: User;
  createdBy: User;
  createdAt: Date;
  isRead: boolean;
  url: string;
};
