import {
  IonButton,
  IonButtons,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonSelect,
  IonSelectOption,
  IonToolbar,
  useIonModal,
  useIonToast,
} from "@ionic/react";
import { pencilSharp, rocketSharp, trashBinSharp } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useApi } from "../../api/security";
import {
  ClientChangeAction,
  ClientChangeModal,
} from "../../components/Clients/ClientChangeModal";
import { ClientDetailsModal } from "../../components/Clients/ClientDetailsModal";
import {
  ClientFiltersAction,
  ClientFiltersModal,
} from "../../components/Clients/ClientFiltersModal";
import {
  Client,
  ClientConfiguration,
  ClientField,
} from "../../types/app.types";
import "./ClientsPage.css";

export const ClientsPage = () => {
  const [presentLoading, setPresentLoading] = useState<boolean>();
  const [presentConfirmDelete, setPresentConfirmDelete] = useState<boolean>();
  const [configuration, setConfiguration] = useState<ClientConfiguration[]>([]);
  const [selectedClientType, setSelectedClientType] =
    useState<ClientConfiguration | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [clientView, setClientView] = useState<Client | null>(null);
  const [clientEdit, setClientEdit] = useState<Client | null>(null);
  const [sortField, setSortField] = useState<string | null>(null);
  const [filters, setFilters] = useState<ClientField[] | null>(null);

  const [presentToast] = useIonToast();
  const { getConfiguration, getClientsByType, saveClient, removeClient } =
    useApi();

  const [presentClientDetailsModal, dismissClientDetailsModal] = useIonModal(
    ClientDetailsModal,
    {
      client: clientView,
      onDismiss: () => {
        setClientView(null);
        dismissClientDetailsModal();
      },
    }
  );

  const [presentClientChange, dismissClientChange] = useIonModal(
    ClientChangeModal,
    {
      client: clientEdit,
      configuration: selectedClientType,
      onDismiss: (data: Client | null, action: ClientChangeAction) => {
        dismissClientChange();
        if (action == "cancel") {
          return;
        }
        if (action == "add") {
          handleSaveClient(data as Client);
          return;
        }
        if (action == "edit") {
          handleSaveClient(data as Client);
        }
      },
    }
  );

  const [presetFiltersModal, dismissPresentFiltersModal] = useIonModal(
    ClientFiltersModal,
    {
      currentFilters: filters,
      fields: selectedClientType?.fieldConfigurations,
      onDismiss: (data: ClientField[] | null, action: ClientFiltersAction) => {
        dismissPresentFiltersModal();
        if (action == "cancel") {
          return;
        }
        if (action == "apply") {
          setFilters(data);
        }
      },
    }
  );

  const openUpSertClientModal = () => {
    presentClientChange({
      onWillDismiss: (e: any) => {
        setClientEdit(null);
      },
    });
  };

  useEffect(() => {
    fetchConfiguration()
      .then(() => setPresentLoading(false))
      .catch((err) => {
        setPresentLoading(false);
        presentToast({
          message: "Ocorreu um erro ao buscar a configuração",
          duration: 2000,
          position: "top",
          color: "danger",
        });
      });
  }, []);

  useEffect(() => {
    fetchClients()
      .then(() => setPresentLoading(false))
      .catch((err) => {
        setPresentLoading(false);
        presentToast({
          message: "Ocorreu um erro ao buscar as informações de clientes",
          duration: 2000,
          position: "top",
          color: "danger",
        });
      });
  }, [selectedClientType]);

  useEffect(() => {
    fetchClients()
      .then(() => setPresentLoading(false))
      .catch((err) => {
        setPresentLoading(false);
        presentToast({
          message: "Ocorreu um erro ao buscar as informações de clientes",
          duration: 2000,
          position: "top",
          color: "danger",
        });
      });
  }, [sortField]);

  const handlSelectType = (event: any) => {
    const target = event.target as HTMLInputElement;
    const selectedType = configuration.find((it) => it.name === target.value);
    setSelectedClientType(selectedType ?? null);
  };

  const handleSaveClient = (client: Client) => {
    if (selectedClientType == null) return;
    setPresentLoading(true);

    saveClient({ ...client, clientType: selectedClientType.name })
      .then((res) => {
        setPresentLoading(false);
        setClients((prev) => {
          const index = prev.findIndex((it) => it.id === client.id);
          if (index === -1) return [...prev, client];
          prev[index] = client;
          return [...prev];
        });
      })
      .catch((err) => {
        setPresentLoading(false);
        presentToast({
          message: "Ocorreu um erro ao salvar as informações de clientes",
          duration: 2000,
          position: "top",
          color: "danger",
        });
      });
  };

  const fetchClients = async () => {
    if (selectedClientType?.name == "") return;
    setPresentLoading(true);
    const clients = (await getClientsByType({
      page: 1,
      //TODO! Implement Infinit Scroll pagination
      pageSize: 1000,
      clientType: selectedClientType?.name ?? "",
      orderBy: sortField
        ? {
            fieldName: sortField,
          }
        : null,
    })) as Client[];

    setClients([...clients]);
  };

  const fetchConfiguration = async () => {
    setPresentLoading(true);
    const res = await getConfiguration();
    setConfiguration(res);
  };

  const handleViewClientDetails = (client: Client) => {
    setClientView(client);
    presentClientDetailsModal();
  };

  const handleEditClient = (client: Client) => {
    setClientEdit(client);
    openUpSertClientModal();
  };

  const handleDeleteClient = (client: Client) => {
    setPresentLoading(true);
    removeClient(client.id)
      .then((res) => {
        setClients((prev) => {
          const index = prev.findIndex((it) => it.id === client.id);
          if (index === -1) return [...prev];
          prev.splice(index, 1);
          return [...prev];
        });
      })
      .catch((err) => {
        presentToast({
          message: "Ocorreu um erro ao remover as informações de clientes",
          duration: 2000,
          position: "top",
          color: "danger",
        });
      })
      .finally(() => {
        setPresentLoading(false);
      });
  };

  function openConfirmDeleteDialog(client: Client) {
    setClientEdit(client);
    setPresentConfirmDelete(true);
    console.log(presentConfirmDelete);
  }

  return (
    <>
      <IonLoading isOpen={presentLoading} message="Carregando..." />
      <IonToolbar>
        <IonItem color="primary">
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
          <IonButtons slot="end">
            <IonButton
              fill="outline"
              color="success"
              onClick={() => openUpSertClientModal()}
              disabled={selectedClientType == null}
            >
              Adicionar
            </IonButton>
          </IonButtons>
        </IonItem>
        <IonItem color="light" className="ion-paddin-bottom">
          <IonSelect
            disabled={!selectedClientType}
            style={{ marginRight: "1em" }}
            interface="popover"
            labelPlacement="stacked"
            label="Organizar por"
            placeholder="Campo"
            value={sortField}
            onIonChange={(e) => setSortField(e.target.value)}
          >
            {selectedClientType?.fieldConfigurations.map((config) => (
              <IonSelectOption key={config.name} value={config.name}>
                {config.name}
              </IonSelectOption>
            ))}
          </IonSelect>
          <IonButton
            disabled={!selectedClientType}
            fill="clear"
            color="tertiary"
            onClick={(e) => presetFiltersModal()}
          >
            Filtros
          </IonButton>
        </IonItem>
      </IonToolbar>
      <IonContent>
        <IonList>
          {clients.map((client) => (
            <IonItem
              key={client.id}
              detail={true}
              button
              onClick={(e) => handleViewClientDetails(client)}
            >
              <IonLabel>
                <h3>{client.fieldValues[0].value}</h3>
                <p>
                  {client.fieldValues
                    .slice(1, 5)
                    .map((f) => `${f.field.name}: ${f.value} `)}
                </p>
              </IonLabel>
              <IonButtons slot="end">
                <IonButton>
                  <IonIcon icon={rocketSharp} />
                </IonButton>
                <IonButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClient(client);
                  }}
                >
                  <IonIcon icon={pencilSharp} />
                </IonButton>
                <IonButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClient(client);
                  }}
                >
                  <IonIcon icon={trashBinSharp} color="danger" />
                </IonButton>
              </IonButtons>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </>
  );
};
