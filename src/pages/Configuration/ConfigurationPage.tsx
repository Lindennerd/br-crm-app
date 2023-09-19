import {
  IonButton,
  IonButtons,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonSelect,
  IonSelectOption,
  IonText,
  IonToolbar,
  useIonModal,
  useIonToast,
} from "@ionic/react";
import {
  addSharp,
  pencilSharp,
} from "ionicons/icons";
import { useConfigurationApi } from "../../api/useConfigurationApi";
import { useFieldType } from "../../common/getFieldType";
import { ClientTypeModal } from "../../components/Configuration/ClientTypeModal";
import { ClientConfiguration } from "../../types/app.types";
import { atom, useAtom } from "jotai";
import "./ConfigurationPage.css";
import { useEffectOnce } from "../../common/useEffectOnce";
import { useLoadingContext } from "../../context/LoadingContext";

const configurationPageState = atom({
  clientTypes: [] as ClientConfiguration[],
  selectedClientType: null as ClientConfiguration | null,
});

export const ConfigurationPage = () => {
  const  { setLoading } = useLoadingContext();
  const [state, setState] = useAtom(configurationPageState);
  const { getClientConfiguration, saveConfiguration } = useConfigurationApi();
  const [presentToast] = useIonToast();
  const { getFieldType } = useFieldType();

  const [presentClientTypeModal, dismissClientTypeModal] = useIonModal(
    ClientTypeModal,
    {
      clientConfiguration: state.selectedClientType,
      onDismiss: (data: ClientConfiguration, role: string) => {
        if (role === "save") {
          saveConfiguration(data)
            .then((res) => {
              data.id = res.clientConfigurationId;
              setState(prev => {
                const index = prev.clientTypes.findIndex(c => c.id == data.id);
                if (index > -1) {
                  prev.clientTypes[index] = data;
                  prev.selectedClientType = data;
                } else {
                  prev.clientTypes.push(data);
                }
                return {...prev};
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
        }

        dismissClientTypeModal(data, role);
      },
    }
  );

  useEffectOnce(() => {
    setLoading(true);
    const fetchClientTypes = async () => {
      const configuration = await getClientConfiguration();
      setState({ ...state, clientTypes: configuration });
      setLoading(false);
    };

    fetchClientTypes();
  });

  return (
    <>
      <IonToolbar
        style={{ paddingLeft: "1rem", paddingRight: "1rem" }}
      >
        <IonSelect
          color="secondary"
          placeholder="Selecione um tipo de cliente"
          label="Configurações de Clientes"
          labelPlacement="stacked"
          interface="popover"
          value={state.selectedClientType}
          onIonChange={(e) =>
            setState({ ...state, selectedClientType: e.detail.value })
          }
        >
          {state.clientTypes?.map((clientType, index) => (
            <IonSelectOption value={clientType} key={index}>
              {clientType.name}
            </IonSelectOption>
          ))}
        </IonSelect>
        <IonButtons slot="end">
          <IonButton
            color="secondary"
            fill="solid"
            onClick={(e) => presentClientTypeModal()}
          >
            <IonIcon md={addSharp} icon={addSharp}></IonIcon>
          </IonButton>
          <IonButton
            color="secondary"
            fill="solid"
            onClick={(e) => presentClientTypeModal()}
          >
            <IonIcon md={pencilSharp} icon={pencilSharp}></IonIcon>
          </IonButton>
        </IonButtons>
      </IonToolbar>
      <IonContent>
        <IonList>
          {state.selectedClientType != null &&
            state.selectedClientType.fieldConfigurations.map((field, index) => (
              <IonItem key={index}>
                <IonLabel>{field.name}</IonLabel>
                <div style={{display: "flex", gap: "1rem", fontSize: "small"}}>
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
