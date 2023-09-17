import {
  IonGrid,
  IonRow,
  IonCol,
  IonInput,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { checkmarkSharp } from "ionicons/icons";
import { useState } from "react";

export interface AdditionalInformationFormProps {
  field: string;
  value: string;
  onAdd: (field: string, value: string) => void;
}

export const AdditionalInformationForm = (
  props: AdditionalInformationFormProps
) => {
  const [values, setValues] = useState<{ field: string; value: string }>({
    field: props.field,
    value: props.value,
  });

  return (
    <IonGrid>
      <IonRow>
        <IonCol>
          <IonInput
            label="Campo"
            labelPlacement="floating"
            value={values.field}
            onIonChange={(e) =>
              setValues((prev) => ({ ...prev, field: e.detail.value ?? "" }))
            }
          />
        </IonCol>
        <IonCol>
          <IonInput
            label="Valor"
            labelPlacement="floating"
            value={values.value}
            onIonChange={(e) => setValues((prev) => ({ ...prev, value: e.detail.value ?? "" }))}
          />
        </IonCol>
        <IonCol size="1">
          <IonButton
            fill="solid"
            style={{ height: "100%" }}
            onClick={(e) => {
                setValues({field: "", value: ""})
                props.onAdd(values.field, values.value)
            }}
          >
            <IonIcon icon={checkmarkSharp}></IonIcon>
          </IonButton>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};
