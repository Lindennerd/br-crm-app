import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonModal,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  useIonLoading,
  useIonToast,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { useApi } from "../../api/security";
import { ClientForm } from "../../components/Clients/ClientForm";
import { Client, ClientConfiguration } from "../../types/app.types";

export const ClientsPage = () => {
  const [presentLoading, dismissLoading] = useIonLoading();
  const [presentToast, dismissToast] = useIonToast();

  const { getConfiguration, getClientsByType, saveClient } = useApi();
  const [configuration, setConfiguration] = useState<ClientConfiguration[]>([]);
  const [selectedClientType, setSelectedClientType] =
    useState<ClientConfiguration | null>(null);

  const [openAddClientModal, setOpenAddClientModal] = useState(false);

  useEffect(() => {
    const fetchConfiguration = async () => {
      const res = await getConfiguration();
      setConfiguration(res);
    };

    fetchConfiguration().catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const fetchClients = async () => {
      const res = await getClientsByType({
        page: 1,
        size: 10,
        clientType: selectedClientType?.name ?? "",
      });
    };

    fetchClients().catch((err) => console.log(err));
  }, [selectedClientType]);

  const handlSelectType = (event: any) => {
    const target = event.target as HTMLInputElement;
    const selectedType = configuration.find((it) => it.name === target.value);
    setSelectedClientType(selectedType ?? null);
  };

  const handleSaveClient = (client: Client) => {
    if (selectedClientType == null) return;

    presentLoading("Salvando Cliente...");
    saveClient({ ...client, clientType: selectedClientType.name })
      .then((res) =>
        presentToast({
          message: "Cliente salvo com sucesso!",
          duration: 2000,
          position: "middle",
          color: "success",
        })
      )
      .catch((err) => presentToast(err.message, 2000))
      .finally(() => dismissLoading());
  };

  return (
    <>
      <IonToolbar>
        <IonItem>
          <IonSelect
            interface="popover"
            onIonChange={handlSelectType}
            placeholder="Selecione o Tipo de Cliente"
          >
            {configuration.map((config) => (
              <IonSelectOption key={config.name} value={config.name}>
                {config.name}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
        <IonItem slot="end">
          <IonButton
            onClick={() => setOpenAddClientModal(true)}
            disabled={selectedClientType == null}
          >
            Adicionar
          </IonButton>
        </IonItem>
      </IonToolbar>
      <IonContent className="ion-padding">
        <IonModal isOpen={openAddClientModal}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Adicionar Cliente</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setOpenAddClientModal(false)}>
                  Fechar
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            {selectedClientType !== null && (
              <ClientForm
                setIsOpen={setOpenAddClientModal}
                saveClient={handleSaveClient}
                configuration={selectedClientType}
              />
            )}
          </IonContent>
        </IonModal>
      </IonContent>
    </>
  );
};
