import {
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useState } from "react";
import {
  Client,
  ClientConfiguration,
  FieldConfiguration,
} from "../../types/app.types";

export type ClientChangeAction = "add" | "edit" | "cancel";
export type ClientChangeModalParams = {
  onDismiss: (data: Client | null, action: ClientChangeAction) => void;
  client: Client | null;
  configuration: ClientConfiguration;
};

export const ClientChangeModal = ({
  onDismiss,
  client,
  configuration,
}: ClientChangeModalParams) => {
  const [changeClient, setChangeClient] = useState<Client>(
    client ?? ({} as Client)
  );

  function setFieldValue(
    value: string | number,
    field: FieldConfiguration
  ): void {
    //set or edit fields
    return setChangeClient((prev) => {
      if (!prev.fieldValues) prev.fieldValues = [];
      const fieldValue = prev.fieldValues?.find(
        (it) => it.field.name === field.name
      );
      if (fieldValue) {
        fieldValue.value = value.toString();
      } else {
        prev.fieldValues?.push({
          field: field,
          value: value.toString(),
        });
      }
      return prev;
    });
  }

  function getFieldValue(field: FieldConfiguration): string {
    const fieldValue = changeClient.fieldValues?.find(
      (it) => it.field.name === field.name
    );
    return fieldValue?.value ?? "";
  }

  return (
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
          <IonTitle>{`${
            client === null ? "Adicionar" : "Editar"
          } Cliente do Tipo ${configuration.name}`}</IonTitle>
          <IonButtons slot="end">
            <IonButton
              color="success"
              fill="clear"
              onClick={(e) =>
                onDismiss(changeClient, client == null ? "add" : "edit")
              }
            >
              Salvar
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {configuration.fieldConfigurations.map((field) => {
          switch (field.type) {
            case 0:
              return (
                <IonItem key={field.name}>
                  <IonLabel position="fixed">{field.name}</IonLabel>
                  {field.possibleValues?.every((it) => it === "") ? (
                    <IonInput
                      type="text"
                      value={getFieldValue(field)}
                      onIonChange={(e) =>
                        setFieldValue(e.target.value ?? "", field)
                      }
                    ></IonInput>
                  ) : (
                    <IonSelect
                      interface="popover"
                      value={getFieldValue(field)}
                      onIonChange={(e) =>
                        setFieldValue(e.target.value ?? "", field)
                      }
                    >
                      {field.possibleValues?.map((f) => (
                        <IonSelectOption key={f} value={f}>
                          {f}
                        </IonSelectOption>
                      ))}
                    </IonSelect>
                  )}
                </IonItem>
              );
            case 1:
              return (
                <IonItem key={field.name}>
                  <IonLabel position="floating">{field.name}</IonLabel>
                  <IonInput
                    type="number"
                    value={getFieldValue(field)}
                    onIonChange={(e) =>
                      setFieldValue(e.target.value ?? "", field)
                    }
                  ></IonInput>
                </IonItem>
              );
            case 2:
              return (
                <IonItem key={field.name}>
                  <IonLabel position="floating">{field.name}</IonLabel>
                  <IonDatetime
                    value={getFieldValue(field)}
                    onIonChange={(e) =>
                      setFieldValue(e.target.value?.toString() ?? "", field)
                    }
                  ></IonDatetime>
                </IonItem>
              );
            // eslint-disable-next-line
            default:
              return (
                <IonItem key={field.name}>
                  <IonLabel position="floating">{field.name}</IonLabel>
                  <IonInput
                    type="text"
                    value={getFieldValue(field)}
                    onIonChange={(e) =>
                      setFieldValue(e.target.value ?? "", field)
                    }
                  ></IonInput>
                </IonItem>
              );
          }
        })}
      </IonContent>
    </IonPage>
  );
};
