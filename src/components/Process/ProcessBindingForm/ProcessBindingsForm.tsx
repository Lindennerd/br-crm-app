import {
  IonCol,
  IonGrid,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonRow,
} from "@ionic/react";
import { SelectClientType } from "../../Clients/SelectClientType";
import { SearchBar } from "../../Common/SearchBar";
import { useEffect, useState } from "react";
import { useGetClientsByType } from "../../../api/useClientApi";
import { Client, GetClientsRequest } from "../../../types/app.types";
import { useClient } from "../../../common/useClient";
import { useGetClientConfiguration } from "../../../api/useConfigurationApi";

export const ProcessBindingsForms = (props: {
  setClient: (client: Client) => void;
  client: Client | undefined;
}) => {

  const { displayFirstField } = useClient();

  const [filter, setFilter] = useState<Partial<GetClientsRequest>>({
    page: 1,
    pageSize: 10,
  });
  const [searchResult, setSearchResult] = useState<Client[]>(props.client ? [props.client] : []);

  function getIsQueryEnabled(): boolean {
    return !!filter && !!filter?.clientTypeId && !!filter?.fieldsFilter;
  }

  const { data: clientConfiguration } = useGetClientConfiguration();
  const { data: querySearchResult, isLoading } = useGetClientsByType(
    filter,
    getIsQueryEnabled()
  );


  useEffect(() => {
    if (!querySearchResult) return;
    setSearchResult(querySearchResult);
  },  [querySearchResult]);

  function handleClientSearch(value: string) {
    const selectedClientType = clientConfiguration?.find(
      (clientType) => clientType.id === filter?.clientTypeId
    );

    if (!selectedClientType) return;

    const fieldsFilter = selectedClientType.fieldConfigurations.map((field) => {
      return { [field.name]: value };
    });

    setFilter({ ...filter, fieldsFilter: fieldsFilter[0] });
  }

  function handleSelectClient(client: Client) {
    props.setClient(client);
  }

  return (
    <>
      <div>
        <IonGrid>
          <IonNote style={{ marginTop: "1em" }}>
            Selecione o tipo de cliente, o campo pelo qual deseja pesquisar e
            vincule o cliente ao processo que você está criando
          </IonNote>
          <IonRow>
            <IonCol></IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <SelectClientType
                clientTypes={clientConfiguration ?? []}
                onSelected={(clientType) =>
                  setFilter({
                    ...filter,
                    clientTypeId: clientType.id ?? undefined,
                  })
                }
              />
            </IonCol>
          </IonRow>
        </IonGrid>
          <SearchBar
            onSearch={(value) => {
              handleClientSearch(value);
            }}
            label="Pesquisar"
            placeholder="Pesquisar cliente para vincular ao processo"
            disabled={!filter?.clientTypeId || isLoading}
          />
        {isLoading && <IonNote>Pesquisando...</IonNote>}
      </div>

      <IonList>
        {searchResult?.length === 0 && (
          <IonItem>
            <IonLabel>Nenhum cliente encontrado</IonLabel>
          </IonItem>
        )}
        {searchResult?.map((client) => (
          <IonItem
            button
            onClick={(e) => handleSelectClient(client)}
            key={client.id}
            color={
              client && props.client &&
              client.id === props.client.id
                ? "primary"
                : "light"
            }
          >
            <IonLabel>
              {displayFirstField(
                client,
                client.clientConfiguration.fieldConfigurations
              )}
            </IonLabel>
          </IonItem>
        ))}
      </IonList>
    </>
  );
};
