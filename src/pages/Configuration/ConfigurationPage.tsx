import {
  IonButton,
  IonButtons,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonSelect,
  IonSelectOption,
  IonText,
  IonToolbar,
  useIonModal,
} from "@ionic/react";
import { addSharp, pencilSharp } from "ionicons/icons";
import { useGetClientConfiguration } from "../../api/useConfigurationApi";
import { useFieldType } from "../../common/getFieldType";
import { ClientTypeModal } from "../../components/Configuration/ClientTypeModal";
import { ClientConfiguration } from "../../types/app.types";
import "./ConfigurationPage.css";
import React from "react";

export const ConfigurationPage = () => {
  const [selectedClientType, setSelectedClientType] =
    React.useState<ClientConfiguration | null>();
  const { getFieldType } = useFieldType();

  const { data: clientConfigurations } = useGetClientConfiguration();

  const [presentClientTypeModal, dismissClientTypeModal] = useIonModal(
    ClientTypeModal,
    {
      clientConfiguration: selectedClientType,
      onDismiss: (data: ClientConfiguration, role: string) => {
        role == "save" && setSelectedClientType(data);
        dismissClientTypeModal(data, role);
      },
    }
  );

  return (
    <>
      <IonToolbar
        color="secondary"
        style={{ paddingLeft: "1rem", paddingRight: "1rem" }}
      >
        <IonSelect
          color="tertiary"
          placeholder="Selecione um tipo de cliente"
          label="Configurações de Clientes"
          labelPlacement="stacked"
          interface="popover"
          value={selectedClientType}
          onIonChange={(e) => setSelectedClientType(e.detail.value)}
        >
          {clientConfigurations?.map((clientType) => (
            <IonSelectOption value={clientType} key={clientType.id}>
              {clientType.name}
            </IonSelectOption>
          ))}
        </IonSelect>
        <IonButtons slot="end">
          <IonButton
            color="tertiary"
            fill="solid"
            onClick={() =>
              presentClientTypeModal({
                backdropDismiss: false,
              })
            }
          >
            <IonIcon md={addSharp} icon={addSharp}></IonIcon>
          </IonButton>
          <IonButton
            color="tertiary"
            fill="solid"
            onClick={() =>
              presentClientTypeModal({
                backdropDismiss: false,
              })
            }
          >
            <IonIcon md={pencilSharp} icon={pencilSharp}></IonIcon>
          </IonButton>
        </IonButtons>
      </IonToolbar>
      <IonContent>
        <IonList>
          {selectedClientType != null &&
            selectedClientType.fieldConfigurations.map((field, index) => (
              <IonItem key={index}>
                <IonLabel>{field.name}</IonLabel>
                <div
                  style={{ display: "flex", gap: "1rem", fontSize: "small" }}
                >
                  <IonText>Tipo: {getFieldType(field.type)}</IonText>
                  {field.required && (
                    <IonText color="danger">Obrigatório</IonText>
                  )}
                </div>
              </IonItem>
            ))}
        </IonList>
      </IonContent>
    </>
  );
};
