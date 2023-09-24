import {
  IonAccordion,
  IonAccordionGroup,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonItemDivider,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonToast,
} from "@ionic/react";
import { useState } from "react";
import { ClientConfiguration, FieldConfiguration } from "../../types/app.types";
import { closeSharp } from "ionicons/icons";
import { ClientTypeFieldForm } from "./ClientTypeFieldForm";
import { useSaveConfguration } from "../../api/useConfigurationApi";

interface ClientTypeModalProps {
  clientConfiguration: ClientConfiguration | null;
  onDismiss: (data?: ClientConfiguration | null, role?: string) => void;
}

const emptyState: ClientConfiguration = {
  name: "",
  fieldConfigurations: [],
  id: null,
};

export const ClientTypeModal = (props: ClientTypeModalProps) => {
  const saveConfigMutation = useSaveConfguration();
  const [presentToast] = useIonToast();

  const [state, setState] = useState<ClientConfiguration>(
    props.clientConfiguration || emptyState
  );

  function handleDismissCancel() {
    setState(emptyState);
    props.onDismiss(null, "cancel");
  }

  function handleDismissSave() {
    saveConfigMutation.mutate(state, {
      onSuccess: (data) => {
        props.onDismiss({ ...state, id: data.clientConfigurationId }, "save");
        setState(emptyState);
      },
    });
  }

  function handleSaveField(field: FieldConfiguration) {
    if (state.fieldConfigurations.find((f) => f.name == field.name) != null) {
      presentToast({
        message: "Já existe um campo com esse nome",
        color: "danger",
        duration: 2000,
        position: "top",
      });
      return;
    }
    setState({
      ...state,
      fieldConfigurations: [...state.fieldConfigurations, field],
    });
  }

  function handleRemoveField(fieldName: string) {
    setState({
      ...state,
      fieldConfigurations: state.fieldConfigurations.filter(
        (field) => field.name != fieldName
      ),
    });
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="secondary">
          <IonButtons slot="start">
            <IonButton color="medium" onClick={(e) => handleDismissCancel()}>
              <IonIcon icon={closeSharp}></IonIcon>
            </IonButton>
          </IonButtons>
          <IonTitle>Adicionar Tipo de Cliente</IonTitle>
          <IonButtons slot="end">
            <IonButton color="success" onClick={(e) => handleDismissSave()}>
              Salvar
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="ion-padding">
          <IonInput
            fill="solid"
            value={state.name}
            onIonChange={(e) => setState({ ...state, name: e.detail.value! })}
            label="Nome do Tipo de Cliente"
            labelPlacement="stacked"
          />
        </div>
        <IonAccordionGroup>
          <IonAccordion value="form-fields">
            <IonItem slot="header" color="primary">
              <IonTitle>Novo Campo</IonTitle>
            </IonItem>
            <IonItem slot="content">
              <ClientTypeFieldForm
                order={state.fieldConfigurations.length + 1}
                onSave={(field) => handleSaveField(field)}
              />
            </IonItem>
          </IonAccordion>
        </IonAccordionGroup>
        <IonItemDivider />
        <IonList>
          {state.fieldConfigurations.map((field, index) => (
            <IonItem key={index}>
              <IonTitle>{field.name}</IonTitle>
              <IonButtons slot="end">
                <IonButton
                  color="danger"
                  onClick={(e) => handleRemoveField(field.name)}
                >
                  <IonIcon icon={closeSharp}></IonIcon>
                </IonButton>
              </IonButtons>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};
