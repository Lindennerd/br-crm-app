import { useQueryClient } from "react-query";
import { ClientNew } from "../../../types/app.types";
import {
  IonButton,
  IonButtons,
  IonFooter,
  IonIcon,
  IonItem,
  IonLabel,
  useIonModal,
} from "@ionic/react";
import {
  documentAttachSharp,
  pencilSharp,
  trashBinSharp,
} from "ionicons/icons";
import { Tooltip } from "react-tooltip";

import "./ClientsList.css";
import "react-tooltip/dist/react-tooltip.css";
import { useState } from "react";
import { ClientChangeModal } from "../ClientChangeModal/ClientChangeModal";
import {
  useGetClientsByTypeInfinite,
  useRemoveClient,
} from "../../../api/useClientApi";

interface ClientsListProps {
  clientTypeId: string;
  fields: { [key: string]: string };
}

export const ClientsList = (props: ClientsListProps) => {
  const [clientChange, setClientChange] = useState<ClientNew | null>(null);
  const [presentClientChangeModal, dismiss] = useIonModal(ClientChangeModal, {
    client: clientChange,
    clientConfiguration: null,
    onDismiss: () => dismiss(),
  });

  const {
    data: clients,
    hasNextPage,
    fetchNextPage,
  } = useGetClientsByTypeInfinite({
    clientTypeId: props.clientTypeId,
    fieldsFilter: props.fields ?? {},
    page: 1,
  });

  const queryClient = useQueryClient();
  const removeClientMutation = useRemoveClient();

  function getFirstField(client: ClientNew) {
    return `${client.clientConfiguration.fieldConfigurations[0].name}: ${
      client.fieldValues[client.clientConfiguration.fieldConfigurations[0].name]
    }`;
  }

  function getFiveFields(client: ClientNew) {
    return (
      <>
        {client.clientConfiguration.fieldConfigurations
          .slice(1, 5)
          .map((field) => (
            <p key={field.name}>
              {field.name}: {client.fieldValues[field.name]}
            </p>
          ))}
      </>
    );
  }

  function onRemoveClient(client: ClientNew) {
    removeClientMutation.mutate(client.id!, {
      onSuccess: () => {
        queryClient.invalidateQueries("getClientsByType");
      },
    });
  }

  return (
    <>
      {!clients && (<></>)}
      {clients &&
        clients.pages.map((page) => {
          {
            return page.map((client) => {
              return (
                <IonItem key={client.id} detail button>
                  <IonLabel>
                    <h3 style={{ marginBottom: "1rem", fontWeight: "bold" }}>
                      {getFirstField(client)}
                    </h3>
                    <span>{getFiveFields(client)}</span>
                  </IonLabel>
                  <IonButtons slot="end" className="client-buttons">
                    <IonButton
                      data-tooltip-id={`btn-process-${client.id}`}
                      fill="solid"
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <IonIcon icon={documentAttachSharp} />
                    </IonButton>
                    <IonButton
                      data-tooltip-id={`btn-edit-${client.id}`}
                      fill="solid"
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setClientChange(client);
                        presentClientChangeModal({
                          keyboardClose: false,
                          backdropDismiss: false,
                        });
                      }}
                    >
                      <IonIcon icon={pencilSharp} />
                    </IonButton>
                    <IonButton
                      data-tooltip-id={`btn-remove-${client.id}`}
                      fill="solid"
                      color="danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveClient(client);
                      }}
                    >
                      <IonIcon icon={trashBinSharp} />
                    </IonButton>

                    <Tooltip
                      id={`btn-process-${client.id}`}
                      place="left"
                      content="Ir para Processos"
                      delayShow={500}
                    />
                    <Tooltip
                      id={`btn-edit-${client.id}`}
                      place="left"
                      content="Editar"
                      delayShow={500}
                    />
                    <Tooltip
                      id={`btn-remove-${client.id}`}
                      place="left"
                      content="Remover"
                      delayShow={500}
                    />
                  </IonButtons>
                </IonItem>
              );
            });
          }
        })}
      <IonFooter class="clients-footer">
        <IonButton style={{width: "100%"}} fill="clear" disabled={!hasNextPage} onClick={(e) => fetchNextPage()}>
          Carregar mais
        </IonButton>
      </IonFooter>
    </>
  );
};
