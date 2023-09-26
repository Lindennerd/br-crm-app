import {
  IonGrid,
  IonRow,
  IonCol,
  IonInput,
  IonButton,
  IonIcon,
  IonNote,
} from "@ionic/react";
import { addSharp, checkmarkSharp } from "ionicons/icons";
import { useState } from "react";

export interface AdditionalInformationFormProps {
  onAdd: (field: string, value: string) => void;
}

export const AdditionalInformationForm = (
  props: AdditionalInformationFormProps
) => {
  const [values, setValues] = useState<{
    field: string | undefined;
    value: string | undefined;
  }>({
    field: "",
    value: "",
  });

  return (
    <IonGrid>
      <IonRow>
        <IonCol>
          <IonNote>
            <p>
              Adicione aqui informações relativas ao processo, como protocolos e
              outras.
            </p>
          </IonNote>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <IonInput
            label="Tipo de informação"
            labelPlacement="floating"
            value={values?.field ?? ""}
            onIonChange={(e) =>
              setValues((prev) => {
                return { ...prev, field: e.detail.value ?? "" };
              })
            }
          />
        </IonCol>
        <IonCol>
          <IonInput
            label="Valor"
            labelPlacement="floating"
            value={values.value}
            onIonChange={(e) =>
              setValues((prev) => ({ ...prev, value: e.detail.value ?? "" }))
            }
          />
        </IonCol>
        <IonCol size="1">
          <IonButton
            disabled={!values.field}
            fill="solid"
            style={{ height: "100%" }}
            onClick={(e) => {
              props.onAdd(values.field ?? "", values.value ?? "");
              setValues({ field: "", value: "" });
            }}
          >
            <IonIcon icon={addSharp}></IonIcon>
          </IonButton>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};
