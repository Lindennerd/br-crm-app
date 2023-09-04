import {
  IonButton,
  IonDatetime,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { useState } from "react";
import {
  Client,
  ClientConfiguration,
  FieldConfiguration,
} from "../../types/app.types";

export type ClientFormParams = {
  setIsOpen: (open: boolean) => void;
  saveClient: (client: Client) => void;
  configuration: ClientConfiguration;
};

export const ClientForm = (params: ClientFormParams) => {
  const [client, setClient] = useState<Client>({} as Client);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    params.saveClient(client);
    params.setIsOpen(false);
  };

  function setFieldValue(
    value: string | number,
    field: FieldConfiguration
  ): void {
    return setClient({
      ...client,
      values: [
        ...(client.values ?? []),
        {
          value: value.toString(),
          field: field,
        },
      ],
    });
  }

  function getFieldValue(field: FieldConfiguration): string {
    const fieldValue = client.values?.find(
      (it) => it.field.name === field.name
    );
    return fieldValue?.value ?? "";
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        {params.configuration.fieldConfigurations.map((field) => {
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
                      {field.possibleValues!.map((f) => (
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
        <IonButton color="success" type="submit">
          Salvar
        </IonButton>
      </form>
    </>
  );
};
