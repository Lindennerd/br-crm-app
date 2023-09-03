import {
  IonAccordion,
  IonAccordionGroup,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonRow,
  ToastOptions,
  useIonLoading,
  useIonToast,
} from "@ionic/react";
import { pencilOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useApi } from "../../api/security";
import {
  AddClientTypeForm,
  AddConfigurationForm,
  ConfigurationItem,
} from "../../components/Configuration/AddConfigurationForm";
import { AddConfigurationModal } from "../../components/Configuration/AddConfigurationModal";
import { ClientConfiguration, FieldConfiguration } from "../../types/app.types";
import "./ConfigurationPage.css";

export const ConfigurationPage = () => {
  const [present] = useIonToast();
  const [presentLoading, dismissLoading] = useIonLoading();
  const [open, setOpen] = useState<boolean>(false);
  const { getConfiguration, saveConfiguration } = useApi();
  const [configuration, setConfiguration] = useState<ClientConfiguration[]>([]);
  const [currentField, setCurrentField] = useState<
    FieldConfiguration | undefined
  >();

  useEffect(() => {
    const fetchConfiguration = async () => {
      const res = await getConfiguration();
      setConfiguration(res);
    };

    fetchConfiguration().catch((err) => console.log(err));
  }, []);

  const presentToast = (message: string, color: ToastOptions["color"]) => {
    present({
      message,
      duration: 2000,
      color: color,
      position: "middle",
    });
  };

  const handleAddClientType = (name: string) => {
    if (configuration?.find((config) => config.name === name)) return;
    if (configuration)
      setConfiguration([...configuration, { name, fieldConfigurations: [] }]);
    else setConfiguration([{ name, fieldConfigurations: [] }]);
  };

  const handleEditField = (field: FieldConfiguration) => {
    setCurrentField(field);
    setOpen(true);
  };

  const handleAddOrEditField = (
    field: FieldConfiguration,
    clientTypeName: string
  ) => {
    const newConfiguration = configuration?.map((config) => {
      if (config.name === clientTypeName) {
        const fieldIndex = config.fieldConfigurations.findIndex(
          (f) => f.name === field.name
        );
        if (fieldIndex >= 0) {
          config.fieldConfigurations[fieldIndex] = field;
          return config;
        } else {
          return {
            ...config,
            fieldConfigurations: [...config.fieldConfigurations, field],
          };
        }
      }
      return config;
    });
    if (newConfiguration) setConfiguration(newConfiguration);
  };

  const handleSaveChanges = (name: string) => {
    const currentConfiguration = configuration?.find((c) => c.name === name);
    if (currentConfiguration) {
      presentLoading();
      saveConfiguration(currentConfiguration)
        .then((res) =>
          presentToast("Configurações salvas com sucesso", "success")
        )
        .catch((err) =>
          presentToast("Houve um erro ao salvar as configurações", "danger")
        )
        .finally(async () => await dismissLoading());
    }
  };

  return (
    <>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Novo tipo de cliente</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <AddClientTypeForm add={handleAddClientType} />
        </IonCardContent>
      </IonCard>
      <IonAccordionGroup>
        {configuration?.map((config, index) => {
          return (
            <IonAccordion key={index} value={config.name}>
              <IonItem slot="header" color="light">
                <IonLabel>{config.name}</IonLabel>
              </IonItem>
              <div
                className="ion-padding"
                slot="content"
                style={{ color: "secondary" }}
              >
                <IonButton fill="clear" onClick={() => setOpen(true)}>
                  Adicionar Campo
                </IonButton>
                <AddConfigurationModal isOpen={open} setIsOpen={setOpen}>
                  <AddConfigurationForm
                    currentField={currentField}
                    addField={handleAddOrEditField}
                    clientTypeName={config.name}
                  />
                </AddConfigurationModal>
                <IonGrid>
                  <IonRow
                    style={{ fontWeight: "bold", backgroundColor: "#135d54" }}
                  >
                    <IonCol>Nome</IonCol>
                    <IonCol>Tipo</IonCol>
                    <IonCol>Valor Padrão</IonCol>
                    <IonCol>Valores Possíveis</IonCol>
                    <IonCol size="auto">
                      <IonButton fill="clear" disabled={true}>
                        <IonIcon icon={pencilOutline}></IonIcon>
                      </IonButton>
                    </IonCol>
                  </IonRow>
                  {config.fieldConfigurations.map((field, index) => {
                    return (
                      <ConfigurationItem
                        key={index}
                        item={field}
                        clientTypeName={config.name}
                        openForEdit={handleEditField}
                      />
                    );
                  })}
                </IonGrid>
                <IonButton onClick={() => handleSaveChanges(config.name)}>
                  Salvar Alterações
                </IonButton>
              </div>
            </IonAccordion>
          );
        })}
      </IonAccordionGroup>
    </>
  );
};
