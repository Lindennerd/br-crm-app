import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

export type AddConfigurationModalParams = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  children: React.ReactNode;
};

export const AddConfigurationModal = (params: AddConfigurationModalParams) => {
  return (
    <>
      <IonModal isOpen={params.isOpen}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Adicionar Configuração de Campos</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => params.setIsOpen(false)}>
                Fechar
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>{params.children}</IonContent>
      </IonModal>
    </>
  );
};
