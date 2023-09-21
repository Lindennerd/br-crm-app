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
  const { getFirstValue } = useMapUtils();

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

  return (
    <>
      <div>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonNote style={{ marginTop: "1em" }}>
                Selecione o tipo de cliente, o campo pelo qual deseja pesquisar
                e vincule o cliente ao processo que você está criando
              </IonNote>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <SelectClientType
                clientTypes={controller.state.clientConfigurations}
                onSelected={(clientType) =>
                  controller.setSelectedClientType(clientType)
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
