import { Client } from "../../../types/app.types";
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
} from "@ionic/react";
import { useClientApi } from "../../../api/useClientApi";
import { useConfigurationApi } from "../../../api/useConfigurationApi";
import { checkmarkSharp } from "ionicons/icons";
import { useProcessBindingFormController } from "./useProcessBindingFormController";
import { SelectClientType } from "../../Clients/SelectClientType";
import { SelectClientField } from "../../Clients/SelectClientField";
import { useEffectOnce } from "../../../common/useEffectOnce";
import { useMapUtils } from "../../../api/useMapUtils";
import { SearchBar } from "../../Common/SearchBar";
import { SelectProcessType } from "../SelectProcessType";

export const ProcessBindingsForms = () => {
  const controller = useProcessBindingFormController();

  const { getClientsByType } = useClientApi();
  const { getProcessConfiguration, getClientConfiguration } =
    useConfigurationApi();
  const { objectToMap } = useMapUtils();

  useEffectOnce(() => {
    Promise.all([getProcessConfiguration(), getClientConfiguration()]).then(
      ([processConfigurations, clientConfiguration]) =>
        controller.loadConfigurations(
          processConfigurations,
          clientConfiguration
        )
    );
  });

  function handleClientSearch(value: string) {
    controller.loadingSearch(true);
    getClientsByType({
      clientType: controller.state.selectedClientType?.name ?? "",
      exact: false,
      fieldsFilter: new Map<string, string>().set(
        controller.state.search.field,
        value
      ),
      orderBy: null,
      page: 1,
      pageSize: 10,
    })
      .then((data) => controller.setSearchResult(data))
      .finally(() => controller.loadingSearch(false));
  }

  function getFirstValue(client: Client): string {
    if (!client.fieldValues) return "";
    const value = objectToMap(client.fieldValues).entries().next().value;
    return `${value[0]}: ${value[1]}`;
  }

  return (
    <>
      <IonNote>
        Aqui você pode reaproveitar informações utilizadas em outros processos
      </IonNote>
      <SelectProcessType
        processTypes={controller.state.processConfigurations}
        defaultValue={controller.state.selectedProcessConfiguration}
        onSelected={(processType) =>
          controller.setSelectedProcessConfiguration(processType.id)
        }
      />

      <div style={{ marginTop: "1rem" }}>
        <IonGrid>
          <IonRow>
            <IonCol>
              <SelectClientType
                clientTypes={controller.state.clientConfigurations}
                onSelected={(clientType) =>
                  controller.setSelectedClientType(clientType.id)
                }
              />
            </IonCol>
            <IonCol>
              <SelectClientField
                fields={
                  controller.state.selectedClientType?.fieldConfigurations ?? []
                }
                onSelected={(field) => controller.setSearchField(field.name)}
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
          disabled={controller.searchBarDisabled()}
        />
      </div>

      <IonList>
        {controller.state.clientSearchResult.map((client) => (
          <IonItem
            button
            onClick={(e) => controller.setSelectedClient(client)}
            key={client.id}
            color={
              controller.state.selectedClient &&
              client.id === controller.state.selectedClient.id
                ? "primary"
                : "light"
            }
          >
            <IonLabel>{getFirstValue(client)}</IonLabel>
          </IonItem>
        ))}
      </IonList>
    </>
  );
};
