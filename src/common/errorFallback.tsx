import { IonButton } from "@ionic/react";
import { useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import { clear } from "./storage";
import { useRouter } from "./useRouter";
import erro from "/erro.jpg";
export const ErrorFallback = ({
  error,
  resetErrorBoundary,
}: {
  error: any;
  resetErrorBoundary: any;
}) => {
  const { logout } = useAuthContext();
  const { gotoLogin } = useRouter();

  useEffect(() => {
    logout();
    gotoLogin();
  }, []);

  async function resetApp() {
    await clear();
    window.location.reload();
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1>Ops! Acho que alguma coisa aconteceu aqui...</h1>
      <pre>{error.message}</pre>
      <img src={erro} alt="error" />
      <IonButton onClick={resetApp}>Clique aqui pra resolver</IonButton>
    </div>
  );
};
