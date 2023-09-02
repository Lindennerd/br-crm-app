import { useIonRouter } from "@ionic/react";
import { useEffect } from "react";
import { useAuthContext } from "../../context/AuthContext";

export const LogoutPage = () => {
  const { logout } = useAuthContext();
  const { push } = useIonRouter();
  useEffect(() => {
    logout();
    // push("/");
  });
  return <></>;
};
