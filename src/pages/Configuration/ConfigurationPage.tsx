import {
  IonAccordion,
  IonAccordionGroup,
  IonButton,
  IonButtons,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonPopover,
  IonTitle,
  IonToolbar,
  useIonModal,
  useIonToast,
} from "@ionic/react";
import { OverlayEventDetail } from "@ionic/react/dist/types/components/react-component-lib/interfaces";
import {
  settingsOutline,
  settingsSharp,
  syncCircleSharp,
} from "ionicons/icons";
import { useEffect, useState } from "react";
import { useApi } from "../../api/security";
import { useFieldType } from "../../common/getFieldType";
import { ClientTypeFieldsModal } from "../../components/Configuration/ClientTypeFieldsModal";
import { ClientTypeModal } from "../../components/Configuration/ClientTypeModal";
import { ClientConfiguration, FieldConfiguration } from "../../types/app.types";

export const ConfigurationPage = () => {
  const [clientTypes, setClienTypes] = useState<ClientConfiguration[]>([]);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  const { getConfiguration, saveConfiguration } = useApi();
  const [presentToast, dismissToast] = useIonToast();
  const { getFieldType } = useFieldType();

  const [presentClientTypeModal, dismissClientTypeModal] = useIonModal(
    ClientTypeModal,
    {
      onDismiss: (data: string, role: string) =>
        dismissClientTypeModal(data, role),
    }
  );

  const [presentClientTypeFieldsModal, dismissClientTypeFieldsModal] =
    useIonModal(ClientTypeFieldsModal, {
      clientTypes: clientTypes,
      onDismiss: (data?: ClientConfiguration | null, role?: string) =>
        dismissClientTypeFieldsModal(data, role),
    });

  useEffect(() => {
    const fetchClientTypes = async () => {
      const configuration = await getConfiguration();
      setClienTypes(configuration);
    };

    fetchClientTypes();
  }, []);

  const syncConfiguration = () => {
    clientTypes.map(async (clientType) => {
      //remove any temp id before saving
      if (clientType.id && clientType.id.includes("<tempId>_")) clientType.id = null;
      await saveConfiguration(clientType)
        .then((res) => {
          setHasChanges(false);
          presentToast({
            message: "Configurações salvas com sucesso",
            duration: 2000,
            color: "success",
            position: "top",
          });
        })
        .catch((err) => {
          presentToast({
            message: "Erro ao salvar configurações",
            duration: 2000,
            color: "danger",
            position: "top",
          });
          debugger;
        });
    });
  };

  const handleAddClientType = async (name: string) => {
    if (!name) return;
    if (name === "") return;
    if (clientTypes.find((clientType) => clientType.name === name)) return;

    const newClientType: ClientConfiguration = {
      name,
      fieldConfigurations: [],
      id: "<tempId>_" + name,
    };

    setClienTypes([...clientTypes, newClientType]);
  };

  const handleAddField = async (clientType: ClientConfiguration) => {
    if (!clientType) return;
    if (!clientType.name) return;
    if (!clientType.fieldConfigurations) return;
    if (clientType.fieldConfigurations.length === 0) return;

    const clientTypeIndex = clientTypes.findIndex(
      (ct) => ct.id === clientType.id
    );
    if (clientTypeIndex === -1) return;

    const newClientTypes = [...clientTypes];
    newClientTypes[clientTypeIndex] = clientType;

    setClienTypes(newClientTypes);
    setHasChanges(true);
  };

  const handleRemoveField = async (
    field: FieldConfiguration,
    clientTypeName: string
  ) => {
    if (!field) return;
    if (!field.name) return;
    if (!clientTypeName) return;

    const clientType = clientTypes.find((ct) => ct.name === clientTypeName);
    if (!clientType) return;

    const clientTypeIndex = clientTypes.findIndex(
      (ct) => ct.id === clientType.id
    );
    if (clientTypeIndex === -1) return;

    const fieldIndex = clientType.fieldConfigurations.findIndex(
      (f) => f.name === field.name
    );
    if (fieldIndex === -1) return;

    const newClientTypes = [...clientTypes];
    newClientTypes[clientTypeIndex].fieldConfigurations?.splice(fieldIndex, 1);

    setClienTypes(newClientTypes);
    setHasChanges(true);
  };

  const openClientTypeModal = () => {
    presentClientTypeModal({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === "save") {
          handleAddClientType(ev.detail.data);
        }
      },
    });
  };

  const openClientTypeFieldsModal = () => {
    presentClientTypeFieldsModal({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === "save") {
          handleAddField(ev.detail.data);
        }
      },
    });
  };

  return (
    <>
      <IonToolbar color="secondary">
        <IonTitle>Configurações de Clientes</IonTitle>
        <IonButtons slot="end">
          <IonButton
            disabled={!hasChanges}
            onClick={(e) => syncConfiguration()}
          >
            Salvar Alterações
            <IonIcon icon={syncCircleSharp} />
          </IonButton>
          <IonButton id="trigger-settings">
            Alterar Configurações
            <IonIcon md={settingsSharp} icon={settingsOutline}></IonIcon>
          </IonButton>
          <IonPopover trigger="trigger-settings" triggerAction="click">
            <IonContent>
              <IonButton
                fill="clear"
                color="primary"
                onClick={(e) => openClientTypeModal()}
              >
                Adicionar Tipo de Cliente
              </IonButton>
              <IonButton
                fill="clear"
                color="primary"
                onClick={(e) => openClientTypeFieldsModal()}
              >
                Adicionar Campos
              </IonButton>
            </IonContent>
          </IonPopover>
        </IonButtons>
      </IonToolbar>
      <IonAccordionGroup>
        {clientTypes?.length === 0 && (
          <IonItem>Nenhuma configuração encontrada</IonItem>
        )}
        {clientTypes?.map((clientType) => {
          return (
            <IonAccordion value={clientType.id!} key={clientType.id}>
              <IonItem slot="header">
                <IonLabel>{clientType.name}</IonLabel>
              </IonItem>
              <IonAccordionGroup slot="content">
                {clientType.fieldConfigurations.map((field) => {
                  return (
                    <div key={field.name}>
                      <IonAccordion value={field.name}>
                        <IonItem slot="header" color="tertiary">
                          <IonLabel>
                            {field.name} - {getFieldType(field.type)}
                          </IonLabel>
                        </IonItem>
                        <IonItem slot="content">
                          <IonLabel>
                            Valor padrão: {field.defaultValue} - Valores
                            Possiveis:
                            {field.possibleValues?.join(",")}
                          </IonLabel>
                          <IonButtons>
                            <IonButton
                              fill="clear"
                              color={"danger"}
                              onClick={(e) =>
                                handleRemoveField(field, clientType.name)
                              }
                            >
                              Remover
                            </IonButton>
                          </IonButtons>
                        </IonItem>
                      </IonAccordion>
                    </div>
                  );
                })}
              </IonAccordionGroup>
            </IonAccordion>
          );
        })}
      </IonAccordionGroup>
    </>
  );
};
