import {
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import {
  ClientConfiguration,
  Client,
  FieldConfiguration,
} from "../../types/app.types";

export type ClientFormProps = {
  setClient: (client: Client) => void;
  client?: Client | null;
  clientConfiguration?: ClientConfiguration | null;
};
export const ClientForm = (props: ClientFormProps) => {
  function getConfigurations(): FieldConfiguration[] {
    if (props.client)
      return props.client.clientConfiguration.fieldConfigurations;
    if (props.clientConfiguration)
      return props.clientConfiguration.fieldConfigurations;
    return [];
  }

  function buildClientFromConfiguration() {
    if(props.client) return props.client;
    if (!props.clientConfiguration) return;
    const client: Client = {
      id: null,
      clientTypeId: props.clientConfiguration.id!,
      fieldValues: {},
      clientConfiguration: props.clientConfiguration,
    };

    return client;
  }

  function getFieldValue(field: FieldConfiguration) {
    return props.client?.fieldValues[field.name] ?? "";
  }

  function setFieldValue(field: FieldConfiguration, value: string) {
    const client = buildClientFromConfiguration();
    if (!client) return;
    props.setClient({
      ...(props.client ?? client),
      fieldValues: { ...props.client?.fieldValues, [field.name]: value },
    });
  }

  return (
    <>
      {getConfigurations().map((field) => {
        if (field.type === 0) {
          return (
            <IonItem key={field.name}>
              <IonInput
                label={field.name}
                labelPlacement="floating"
                value={getFieldValue(field)}
                onIonInput={(e) => setFieldValue(field, e.detail.value!)}
              />
            </IonItem>
          );
        } else if (field.type === 1) {
          return (
            <IonItem key={field.name}>
              <IonInput
                label={field.name}
                labelPlacement="floating"
                type="number"
                value={getFieldValue(field)}
                onIonInput={(e) => setFieldValue(field, e.detail.value!)}
              />
            </IonItem>
          );
        } else if (field.type === 2) {
          return (
            <IonItem key={field.name}>
              <IonInput
                label={field.name}
                labelPlacement="stacked"
                type="date"
                value={getFieldValue(field)}
                onIonInput={(e) => setFieldValue(field, e.detail.value!)}
              />
            </IonItem>
          );
        } else if (field.type === 3) {
          return (
            <IonItem key={field.name}>
              <IonSelect
                label={field.name}
                labelPlacement="floating"
                interface="popover"
                value={getFieldValue(field)}
                onIonChange={(e) => setFieldValue(field, e.detail.value)}
              >
                {field.possibleValues?.map((value) => (
                  <IonSelectOption key={value} value={value}>
                    {value}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
          );
        }
      })}
    </>
  );
};
