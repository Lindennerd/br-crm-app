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
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonToast,
} from "@ionic/react";
import { atom, useAtom } from "jotai";
import { useEffect, useRef } from "react";
import { ClientConfiguration, FieldConfiguration } from "../../types/app.types";
import { closeSharp } from "ionicons/icons";
import { ClientTypeFieldForm } from "./ClientTypeFieldForm";

const clientTypeModalState = atom<ClientConfiguration>({
  name: "",
  fieldConfigurations: [],
  id: null,
});

export const ClientTypeModal = ({
  onDismiss,
  clientConfiguration,
}: {
  clientConfiguration: ClientConfiguration | null;
  onDismiss: (data?: ClientConfiguration | null, role?: string) => void;
}) => {
  const [state, setState] = useAtom(clientTypeModalState);
  const [presentToast] = useIonToast();

  useEffect(() => {
    if (clientConfiguration) {
      setState(clientConfiguration);
    }
  }, []);

  function handleDismissCancel() {
    setState({ name: "", fieldConfigurations: [], id: null });
    onDismiss(null, "cancel");
  }

  function handleDismissSave() {
    onDismiss(state, "save");
    setState({ name: "", fieldConfigurations: [], id: null });
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
        <IonToolbar>
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
                onSave={(field) => handleSaveField(field)} />
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
