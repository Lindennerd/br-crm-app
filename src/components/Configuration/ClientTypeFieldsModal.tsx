import {
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonInput,
  IonLabel,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonToolbar,
} from "@ionic/react";
import { useState } from "react";
import { ClientConfiguration, FieldConfiguration } from "../../types/app.types";

export const ClientTypeFieldsModal = ({
  onDismiss,
  clientTypes,
}: {
  clientTypes: ClientConfiguration[];
  onDismiss: (data?: ClientConfiguration | null, role?: string) => void;
}) => {
  const [selectedClientType, setSelectedClientType] =
    useState<ClientConfiguration | null>(null);
  const [field, setField] = useState<FieldConfiguration>(
    {} as FieldConfiguration
  );

  const handleSelectClientType = (clientTypeId: string) => {
    const clientType = clientTypes.find(
      (clientType) => clientType.id === clientTypeId
    );
    if (!clientType) return;
    setSelectedClientType(clientType);
  };

  const handleSaveField = () => {
    if (!selectedClientType) return;
    if (!field.name) return;
    if (!field.type) return;

    setSelectedClientType((prev) => {
      if (!prev) return prev;
      if (!prev.fieldConfigurations) prev.fieldConfigurations = [];
      if (prev.fieldConfigurations.find((f) => f.name === field.name))
        return prev;
      field.type = Number(field.type);
      prev.fieldConfigurations.push(field);
      return prev;
    });

    console.log(field);
    console.log(selectedClientType);

    setField({} as FieldConfiguration);
    onDismiss(selectedClientType, "save");
  };

  return (
    <>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton
                color="medium"
                onClick={(e) => onDismiss(null, "cancel")}
              >
                Cancelar
              </IonButton>
            </IonButtons>
            <IonSelect
              placeholder="Selecione um tipo de cliente para editar"
              interface="popover"
              onIonChange={(e) => handleSelectClientType(e.target.value)}
            >
              {clientTypes.map((clientType) => (
                <IonSelectOption key={clientType.id} value={clientType.id}>
                  {clientType.name}
                </IonSelectOption>
              ))}
            </IonSelect>
            <IonButtons slot="end">
              <IonButton color="primary" onClick={(e) => handleSaveField()}>
                Salvar
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          {selectedClientType && (
            <>
              <IonInput
                style={{ marginBottom: "1em" }}
                type="text"
                placeholder="Nome do tipo de campo"
                label="Nome"
                labelPlacement="stacked"
                value={field.name}
                onIonChange={(e) =>
                  setField({ ...field, name: e.detail.value! })
                }
              />
              <IonSelect
                style={{ marginBottom: "1em" }}
                label="Tipo do campo"
                labelPlacement="stacked"
                interface="popover"
                value={field.type}
                onIonChange={(e) =>
                  setField({ ...field, type: e.detail.value as number })
                }
              >
                <IonSelectOption value="0">Texto</IonSelectOption>
                <IonSelectOption value="1">Número</IonSelectOption>
                <IonSelectOption value="2">Data</IonSelectOption>
              </IonSelect>
              <IonInput
                style={{ marginBottom: "1em" }}
                label="Valor Padrão"
                labelPlacement="stacked"
                value={field.defaultValue}
                onIonChange={(e) =>
                  setField({ ...field, defaultValue: e.detail.value! })
                }
              />
              <IonInput
                style={{ marginBottom: "1em" }}
                label="Valores Possíveis"
                labelPlacement="stacked"
                placeholder="Valores separados por vírgula"
                value={field.possibleValues?.join(",")}
                onIonChange={(e) =>
                  setField({
                    ...field,
                    possibleValues: e.detail.value!.split(","),
                  })
                }
              />

              <IonCheckbox
                style={{ marginBottom: "1em" }}
                checked={field.required}
                onIonChange={(e) =>
                  setField({ ...field, required: e.target.checked })
                }
              >
                Obrigatório?
              </IonCheckbox>
              <IonInput
                style={{ marginBottom: "1em" }}
                label="Ordem"
                labelPlacement="stacked"
                type="number"
                min={1}
                value={field.order}
                onIonChange={(e) =>
                  setField({ ...field, order: Number(e.detail.value!) })
                }
              />
            </>
          )}
        </IonContent>
      </IonPage>
    </>
  );
};
