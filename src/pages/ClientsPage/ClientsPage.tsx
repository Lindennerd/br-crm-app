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
  IonModal,
  IonSelect,
  IonSelectOption,
  IonToolbar,
  useIonModal,
  useIonToast,
} from "@ionic/react";
import {
  addSharp,
  documentAttachOutline,
  documentAttachSharp,
  filterSharp,
  pencilSharp,
  rocketSharp,
  trashBinSharp,
} from "ionicons/icons";
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
import { useEffectOnce } from "../../common/useEffectOnce";
import { useLoadingContext } from "../../context/LoadingContext";
import { useMapUtils } from "../../api/useMapUtils";
import { useCurrentClientContext } from "../../context/CurrentClientContext";
import { useRouter } from "../../common/useRouter";

export const ClientsPage = () => {
  const [presentConfirmDelete, setPresentConfirmDelete] =
    useState<boolean>(false);
  const { setLoading } = useLoadingContext();
  const [configuration, setConfiguration] = useState<ClientConfiguration[]>([]);
  const [selectedClientType, setSelectedClientType] =
    useState<ClientConfiguration | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [clientView, setClientView] = useState<Client | null>(null);
  const [clientEdit, setClientEdit] = useState<Client | null>(null);
  const [sortField, setSortField] = useState<string | null>(null);
  const [filters, setFilters] = useState<ClientField[]>([]);
  const { getFirstValue } = useMapUtils();

  const { setClient: setCurrentClient } =
    useCurrentClientContext();

  const { gotoProcesses } = useRouter();

  const [presentToast] = useIonToast();
  const { getClientsByType, saveClient, removeClient } = useClientApi();

  const { getClientConfiguration } = useConfigurationApi();

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
      client: {
        ...clientEdit,
        fieldValues: clientEdit?.fieldValues,
      },
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
      onWillDismiss: () => {
        setClientEdit(null);
      },
    });
  };

  useEffectOnce(() => {
    fetchConfiguration()
      .catch(() => {
        presentToast({
          message: "Ocorreu um erro ao buscar a configuração",
          duration: 2000,
          position: "top",
          color: "danger",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  });

  useEffect(() => {
    fetchClients()
      .catch(() => {
        presentToast({
          message: "Ocorreu um erro ao buscar as informações de clientes",
          duration: 2000,
          position: "top",
          color: "danger",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedClientType]);

  useEffect(() => {
    fetchClients()
      .catch(() => {
        presentToast({
          message: "Ocorreu um erro ao buscar as informações de clientes",
          duration: 2000,
          position: "top",
          color: "danger",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [sortField]);

  useEffect(() => {
    fetchClients()
      .catch(() => {
        presentToast({
          message: "Ocorreu um erro ao buscar as informações de clientes",
          duration: 2000,
          position: "top",
          color: "danger",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [filters]);

  useEffect(() => {
    setSelectedClientType(configuration[0] ?? null);
    fetchClients()
      .catch(() => {
        presentToast({
          message: "Ocorreu um erro ao buscar as informações de clientes",
          duration: 2000,
          position: "top",
          color: "danger",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [configuration]);

  const handlSelectType = (event: any) => {
    const target = event.target as HTMLInputElement;
    const selectedType = configuration.find((it) => it.name === target.value);
    setSelectedClientType(selectedType ?? null);
  };

  const handleSaveClient = (client: Client) => {
    if (selectedClientType == null) return;

    saveClient({ ...client, clientType: selectedClientType.name })
      .then((res) => {
        console.log(client);
        console.log(clients);
        setClients((prev) => {
          const index = prev.findIndex(
            (it) => it.id === client.id && it.id != null && it.id != ""
          );
          if (index === -1) return [...prev, { ...client, id: res.clientId }];
          prev[index] = client;
          return [...prev];
        });
      })
      .catch(() => {
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
    setLoading(true);
    const fieldsMap = new Map<string, string>();
    filters.forEach((filter) => {
      fieldsMap.set(filter.field.name, filter.value.toString());
    });
    const clients = (await getClientsByType({
      page: 1,
      //TODO! Implement Infinit Scroll pagination
      pageSize: 1000,
      exact: false,
      clientType: selectedClientType?.name ?? "",
      fieldsFilter: fieldsMap,
      orderBy: sortField
        ? {
            fieldName: sortField,
          }
        : null,
    })) as Client[];
    setClients(() => {
      return clients.map((client) => {
        return {
          ...client,
          fieldValues: client.fieldValues,
        };
      });
    });
  };

  const fetchConfiguration = async () => {
    const res = await getClientConfiguration();
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
    setLoading(true);
    removeClient(clientEdit.id)
      .then(() => {
        setClients((prev) => {
          const index = prev.findIndex((it) => it.id === clientEdit.id);
          if (index === -1) return [...prev];
          prev.splice(index, 1);
          return [...prev];
        });
      })
      .catch(() => {
        presentToast({
          message: "Ocorreu um erro ao remover as informações de clientes",
          duration: 2000,
          position: "top",
          color: "danger",
        });
      })
      .finally(() => {
        setClientEdit(null);
        setLoading(false);
      });
  };

  function handleGotoProcesses(client: Client) {
    setCurrentClient(client);
    gotoProcesses();
  }

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
          <IonButtons slot="end">
            <IonButton
              fill="solid"
              color="secondary"
              onClick={() => openUpSertClientModal()}
              disabled={selectedClientType == null}
            >
              <IonIcon icon={addSharp} />
            </IonButton>
            <IonButton
              disabled={!selectedClientType}
              fill="solid"
              color="secondary"
              onClick={() => presetFiltersModal()}
            >
              <IonIcon icon={filterSharp} />({filters.length})
            </IonButton>
          </IonButtons>
        </IonItem>
      </IonToolbar>
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
          {selectedClientType?.fieldConfigurations.map((config, index) => (
            <IonSelectOption key={index} value={config.name}>
              {config.name}
            </IonSelectOption>
          ))}
        </IonSelect>
      </IonItem>
      <IonContent>
        <IonList>
          {clients.map((client) => (
            <IonItem
              key={client.id}
              detail={true}
              button
              onClick={() => handleViewClientDetails(client)}
            >
              <IonLabel>
                <h3>{getFirstValue(client)}</h3>
                <p>
                  {Array.from(client.fieldValues)
                    .slice(1, 5)
                    .map((f) => `${f[0]}: ${f[1]} `)}
                </p>
              </IonLabel>
              <IonButtons slot="end">
                <IonButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGotoProcesses(client);
                  }}
                >
                  <IonIcon icon={documentAttachOutline} />
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
        onWillDismiss={() => setPresentConfirmDelete(false)}
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
                onClick={() => {
                  handleDeleteClient();
                  setPresentConfirmDelete(false);
                }}
              >
                Sim
              </IonButton>
              <IonButton
                fill="solid"
                color="danger"
                onClick={() => {
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
