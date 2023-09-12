import { useEffect, useState } from "react";
import { useProcessPageController } from "../../pages/ProcessPage/ProcessPage.Controller";
import {
  Client,
  ClientConfiguration,
  Process,
  ProcessConfiguration,
} from "../../types/app.types";
import {
  IonButton,
  IonButtons,
  IonCol,
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonRow,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { useClientApi } from "../../api/useClientApi";
import { useConfigurationApi } from "../../api/useConfigurationApi";
import { checkmarkSharp } from "ionicons/icons";
import { changeProcessAtom } from "./ChangeProcessModal";
import { useAtom } from "jotai";

export const ProcessBindingsForms = () => {
  const [changeProcess, setChangeProcess] = useAtom(changeProcessAtom);

  const [configurations, setConfigurations] = useState<ProcessConfiguration[]>(
    []
  );
  const [configuration, setConfiguration] =
    useState<ProcessConfiguration | null>(null);

  const [searchTerm, setSearchTerm] = useState<{
    field: string;
    value: string;
  }>({ field: "", value: "" } as { field: string; value: string });

  const [searching, setSearching] = useState<boolean>(false);

  const [clientConfiguration, setClientConfiguration] = useState<
    ClientConfiguration[]
  >([]);

  const [selectedClientType, setSelectedClientType] = useState<
    ClientConfiguration | undefined
  >(undefined);

  const [selectedClient, setSelectedClient] = useState<
    Client | null | undefined
  >(null);
  const [clientsSearchResult, setClientsSearchResult] = useState<Client[]>([]);

  const { getConfigurations: getProcessConfigurations } =
    useProcessPageController();
  const { getClientsByType } = useClientApi();
  const { getConfiguration: getClientConfiguration } = useConfigurationApi();

  useEffect(() => {
    Promise.all([getProcessConfigurations(), getClientConfiguration()]).then(
      ([processConfigurations, clientConfiguration]) => {
        setConfigurations(processConfigurations);
        setClientConfiguration(clientConfiguration);
      }
    );
  }, [configurations, clientConfiguration]);

  useEffect(() => {
    if (searchTerm.value.length < 3) return;
    setSearching(true);
    const fieldMaps = new Map<string, string>();
    fieldMaps.set(searchTerm.field, searchTerm.value);
    getClientsByType({
      clientType: selectedClientType?.name ?? "",
      exact: false,
      fieldsFilter: fieldMaps,
      orderBy: null,
      page: 1,
      pageSize: 10,
    })
      .then((data) => {
        setClientsSearchResult((prev) => {
          return data.map((client) => {
            return {
              ...client,
              fieldValues: new Map(
                Object.entries(client.fieldValues as Object)
              ),
            };
          });
        });
      })
      .finally(() => setSearching(false));
  }, [searchTerm]);

  function getFirstValue(client: Client): import("react").ReactNode {
    if (!client.fieldValues) return null;
    const value = client.fieldValues.entries().next().value;
    return `${value[0]}: ${value[1]}`;
  }

  return (
    <>
      <IonSelect
        value={configuration?.id}
        label="Selecione uma configuração de processo"
        labelPlacement="floating"
        interface="popover"
        onIonChange={(e) =>
          setConfiguration(
            configurations.find(
              (configuration) => configuration.id === e.detail.value
            ) ?? null
          )
        }
      >
        {configurations.map((configuration) => (
          <IonSelectOption key={configuration.id} value={configuration.id}>
            {configuration.title}
          </IonSelectOption>
        ))}
      </IonSelect>
      <IonNote>
        Aqui você pode reaproveitar informações utilizadas em outros processos
      </IonNote>
      <div style={{ marginTop: "1rem" }}>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonSelect
                label="Selecione o tipo de cliente"
                labelPlacement="floating"
                interface="popover"
                onIonChange={(e) =>
                  setSelectedClientType((prev) =>
                    clientConfiguration.find((c) => c.id == e.detail.value!)
                  )
                }
              >
                {clientConfiguration?.map((clientConfiguration) => (
                  <IonSelectOption
                    key={clientConfiguration.id}
                    value={clientConfiguration.id}
                  >
                    {clientConfiguration.name}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonCol>
            <IonCol>
              <IonSelect
                label="Selecione o Campo"
                labelPlacement="floating"
                interface="popover"
                onIonChange={(e) =>
                  setSearchTerm({ ...searchTerm, field: e.detail.value! })
                }
              >
                {selectedClientType?.fieldConfigurations.map((field) => {
                  if (field.type === 0)
                    return (
                      <IonSelectOption key={field.name} value={field.name}>
                        {field.name}
                      </IonSelectOption>
                    );
                })}
              </IonSelect>
            </IonCol>
          </IonRow>
        </IonGrid>

        {searching && <IonNote>Pesquisando...</IonNote>}
        <IonSearchbar
          disabled={searching || !selectedClientType || !searchTerm.field}
          placeholder="Cliente para vincular ao processo"
          showClearButton="always"
          showCancelButton="focus"
          animated={true}
          debounce={1000}
          onIonInput={(e) =>
            setSearchTerm({ ...searchTerm, value: e.detail.value! })
          }
        />
      </div>

      <IonList>
        {clientsSearchResult.map((client) => (
          <IonItem
            color={
              selectedClient && client.id === selectedClient.id
                ? "success"
                : "light"
            }
          >
            <IonLabel>{getFirstValue(client)}</IonLabel>
            <IonButtons slot="end">
              <IonButton
                onClick={(e) => {
                  setSelectedClient((prev) => {
                    return prev?.id === client.id ? null : client;
                  });
                  changeProcess.client = client.id
                  setChangeProcess(changeProcess);
                }}
              >
                <IonIcon icon={checkmarkSharp}></IonIcon>
              </IonButton>
            </IonButtons>
          </IonItem>
        ))}
      </IonList>
    </>
  );
};
