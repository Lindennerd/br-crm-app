import { Organization } from "../organization/organization";
import { Profile } from "./profile";
import { UserRole } from "./userRole";

export type User = {
  id: string;
  name: string;
  userRole: UserRole;
  organization: Organization;
  profile: Profile;
};
