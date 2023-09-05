import { useIonRouter } from "@ionic/react";
import { useAuthContext } from "../../context/AuthContext";

export const LogoutPage = () => {
  const { logout } = useAuthContext();
  const { push } = useIonRouter();
  logout();
  push("/", "root", "replace");
  return <></>;
};
