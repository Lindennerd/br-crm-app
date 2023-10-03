import { IonButton } from "@ionic/react";
import { clear } from "./storage";
import erro from "/erro.jpg";
export const ErrorFallback = ({
  error,
  resetErrorBoundary,
}: {
  error: any;
  resetErrorBoundary: any;
}) => {
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
