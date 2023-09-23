import {
  IonButton,
  IonButtons,
  IonIcon,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonToolbar,
  useIonModal,
} from "@ionic/react";
import { addSharp, filterSharp } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useGetClientConfiguration } from "../../api/useConfigurationApi";
import { ClientChangeModal } from "../../components/Clients/ClientChangeModal/ClientChangeModal";
import { ClientsList } from "../../components/Clients/ClientList/ClientsList";
import { ClientConfiguration } from "../../types/app.types";
import {
  ClientFiltersAction,
  ClientFiltersModal,
} from "../../components/Clients/ClientFiltersModal";

export const ClientsPage = () => {
  const [selectedClientType, setSelectedClientType] =
    useState<ClientConfiguration>();

  const [filters, setFilters] = useState<{ [key: string]: string }>();

  const { data: clientConfigurations } = useGetClientConfiguration();

  const [presentClientChangeModal, dismiss] = useIonModal(ClientChangeModal, {
    client: null,
    clientConfiguration: selectedClientType
      ? selectedClientType
      : clientConfigurations?.[0]
      ? clientConfigurations[0]
      : null,
    onDismiss: () => dismiss(),
  });

  const [presentFilterModal, dismissFilterModal] = useIonModal(
    ClientFiltersModal,
    {
      currentFilters: filters,
      clientConfiguration: selectedClientType
        ? selectedClientType
        : clientConfigurations?.[0]
        ? clientConfigurations[0]
        : null,
      onDismiss: (
        data: { [key: string]: string },
        action: ClientFiltersAction
      ) => {
        if (action === "apply") {
          setFilters(data);
        }
        dismissFilterModal();
      },
    }
  );

  useEffect(() => {
    if (clientConfigurations && clientConfigurations.length > 0) {
      setSelectedClientType(clientConfigurations[0]);
    }
  }, [clientConfigurations]);

  return (
    <>
      <IonToolbar color="primary">
        <IonItem color="primary">
          <IonSelect
            placeholder="Selecione um tipo de cliente"
            interface="popover"
            value={selectedClientType}
            onIonChange={(e) => {
              setSelectedClientType(e.detail.value);
            }}
          >
            {clientConfigurations?.map((clientConfiguration) => (
              <IonSelectOption
                key={clientConfiguration.id}
                value={clientConfiguration}
              >
                {clientConfiguration.name}
              </IonSelectOption>
            ))}
          </IonSelect>
          <IonButtons slot="end">
            <IonButton
              onClick={(e) =>
                presentClientChangeModal({
                  keyboardClose: false,
                  backdropDismiss: false,
                })
              }
              fill="solid"
              color="tertiary"
              disabled={selectedClientType == null}
            >
              <IonIcon icon={addSharp} />
            </IonButton>
            <IonButton
              onClick={(e) => {
                presentFilterModal({
                  keyboardClose: true,
                  backdropDismiss: false,
                });
              }}
              disabled={!selectedClientType}
              fill="solid"
              color="tertiary"
            >
              <IonIcon icon={filterSharp} />({filters ? Object.keys(filters).length : 0})
            </IonButton>
          </IonButtons>
        </IonItem>
      </IonToolbar>
      {selectedClientType && (
        <ClientsList clientTypeId={selectedClientType.id!} fields={filters ?? {}} />
      )}
    </>
  );
};
