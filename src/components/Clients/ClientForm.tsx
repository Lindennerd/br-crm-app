import {
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { FieldConfiguration } from "../../types/app.types";

export type ClientFormProps = {
  selectedField: FieldConfiguration;
  getFieldValue: (field: FieldConfiguration) => string | number;
  setFieldValue: (value: string | number, field: FieldConfiguration) => void;
};
export const ClientForm = ({
  selectedField,
  getFieldValue,
  setFieldValue,
}: ClientFormProps) => {
  const getFieldJsx = () => {
    switch (selectedField.type) {
      case 0:
        return (
          <IonItem key={selectedField.name} className="ion-margin-bottom">
            <IonLabel position="stacked">{selectedField.name}</IonLabel>
            {selectedField.possibleValues?.every((it) => it === "") ? (
              <IonInput
                type="text"
                value={getFieldValue(selectedField)}
                onIonChange={(e) =>
                  setFieldValue(e.target.value ?? "", selectedField)
                }
              ></IonInput>
            ) : (
              <IonSelect
                interface="popover"
                value={getFieldValue(selectedField)}
                onIonChange={(e) =>
                  setFieldValue(e.target.value ?? "", selectedField)
                }
              >
                {selectedField.possibleValues?.map((f) => (
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
          <IonItem key={selectedField.name} className="ion-margin-bottom">
            <IonLabel position="stacked">{selectedField.name}</IonLabel>
            <IonInput
              type="number"
              value={getFieldValue(selectedField)}
              onIonChange={(e) =>
                setFieldValue(e.target.value ?? "", selectedField)
              }
            ></IonInput>
          </IonItem>
        );
      case 2:
        return (
          <IonItem key={selectedField.name} className="ion-margin-bottom">
            <IonLabel position="stacked">{selectedField.name}</IonLabel>
            <IonInput
              type="date"
              value={getFieldValue(selectedField)}
              onIonChange={(e) =>
                setFieldValue(e.target.value?.toString() ?? "", selectedField)
              }
            ></IonInput>
          </IonItem>
        );
      // eslint-disable-next-line
      default:
        return (
          <IonItem key={selectedField.name} className="ion-margin-bottom">
            <IonLabel position="stacked">{selectedField.name}</IonLabel>
            <IonInput
              type="text"
              value={getFieldValue(selectedField)}
              onIonChange={(e) =>
                setFieldValue(e.target.value ?? "", selectedField)
              }
            ></IonInput>
          </IonItem>
        );
    }
  };

  return <>{selectedField && getFieldJsx()}</>;
};
