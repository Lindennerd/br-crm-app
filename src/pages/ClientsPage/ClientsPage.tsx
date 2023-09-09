import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonModal,
  IonSelect,
  IonSelectOption,
  IonToolbar,
  useIonModal,
  useIonToast,
} from "@ionic/react";
import { pencilSharp, rocketSharp, trashBinSharp } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useClientApi } from "../../api/useClientApi";
import { useConfigurationApi } from "../../api/useConfigurationApi";
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
  const [presentConfirmDelete, setPresentConfirmDelete] =
    useState<boolean>(false);
  const [configuration, setConfiguration] = useState<ClientConfiguration[]>([]);
  const [selectedClientType, setSelectedClientType] =
    useState<ClientConfiguration | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [clientView, setClientView] = useState<Client | null>(null);
  const [clientEdit, setClientEdit] = useState<Client | null>(null);
  const [sortField, setSortField] = useState<string | null>(null);
  const [filters, setFilters] = useState<ClientField[]>([]);

  const [presentToast] = useIonToast();
  const { getClientsByType, saveClient, removeClient } = useClientApi();

  const { getConfiguration } = useConfigurationApi();

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
      onDismiss: (data: ClientField[], action: ClientFiltersAction) => {
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
      .catch((err) => {
        presentToast({
          message: "Ocorreu um erro ao buscar a configuração",
          duration: 2000,
          position: "top",
          color: "danger",
        });
      })
      .finally(() => {
        setPresentLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchClients()
      .catch((err) => {
        presentToast({
          message: "Ocorreu um erro ao buscar as informações de clientes",
          duration: 2000,
          position: "top",
          color: "danger",
        });
      })
      .finally(() => {
        setPresentLoading(false);
      });
  }, [selectedClientType]);

  useEffect(() => {
    fetchClients()
      .catch((err) => {
        presentToast({
          message: "Ocorreu um erro ao buscar as informações de clientes",
          duration: 2000,
          position: "top",
          color: "danger",
        });
      })
      .finally(() => {
        setPresentLoading(false);
      });
  }, [sortField]);

  useEffect(() => {
    fetchClients()
      .catch((err) => {
        presentToast({
          message: "Ocorreu um erro ao buscar as informações de clientes",
          duration: 2000,
          position: "top",
          color: "danger",
        });
      })
      .finally(() => {
        setPresentLoading(false);
      });
  }, [filters]);

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
      fieldsFilter: filters.map((it) => ({
        fieldName: it.field.name,
        fieldValue: it.value,
      })),
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

  const handleDeleteClient = () => {
    if (clientEdit == null) return;
    setPresentLoading(true);
    removeClient(clientEdit.id)
      .then((res) => {
        setClients((prev) => {
          const index = prev.findIndex((it) => it.id === clientEdit.id);
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
        setClientEdit(null);
        setPresentLoading(false);
      });
  };

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
            Filtros ({filters.length})
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
                    setClientEdit(client);
                    setPresentConfirmDelete(true);
                  }}
                >
                  <IonIcon icon={trashBinSharp} color="danger" />
                </IonButton>
              </IonButtons>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
      <IonModal
        isOpen={presentConfirmDelete}
        onWillDismiss={(e) => setPresentConfirmDelete(false)}
      >
        <IonCard>
          <IonCardHeader>
            <IonLabel>
              <h1>Tem certeza que deseja excluir o cliente?</h1>
            </IonLabel>
          </IonCardHeader>
          <IonCardContent>
            <IonButtons
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "2em",
              }}
            >
              <IonButton
                fill="solid"
                color="success"
                onClick={(e) => {
                  handleDeleteClient();
                  setPresentConfirmDelete(false);
                }}
              >
                Sim
              </IonButton>
              <IonButton
                fill="solid"
                color="danger"
                onClick={(e) => {
                  setClientEdit(null);
                  setPresentConfirmDelete(false);
                }}
              >
                Não
              </IonButton>
            </IonButtons>
          </IonCardContent>
        </IonCard>
      </IonModal>
    </>
  );
};
