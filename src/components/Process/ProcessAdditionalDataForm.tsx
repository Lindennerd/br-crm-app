import {
  IonToolbar,
  IonLabel,
  IonButtons,
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonInput,
  IonList,
  IonItem,
} from "@ionic/react";
import {
  addSharp,
  checkmarkSharp,
  closeSharp,
  trashSharp,
} from "ionicons/icons";
import { changeProcessAtom } from "./ChangeProcessModal";
import { useAtom } from "jotai";
import { useState } from "react";

export const ProcessAdditionalDataForm = () => {
  const [process, setProcess] = useAtom(changeProcessAtom);
  const [fieldValue, setFieldValue] = useState<{
    field: string;
    value: string;
  }>({ field: "", value: "" } as { field: string; value: string });

  return (
    <>
      <IonToolbar>
        <IonLabel>Dados Adicionais do processo</IonLabel>
      </IonToolbar>
      <IonGrid>
        <IonRow>
          <IonCol>
            <IonInput
              label="Nome"
              labelPlacement="floating"
              value={fieldValue.field}
              onIonChange={(e) =>
                setFieldValue((prev) => ({
                  ...prev,
                  field: e.detail.value ?? "",
                }))
              }
            />
          </IonCol>
          <IonCol>
            <IonInput
              label="Valor"
              
              labelPlacement="floating"
              value={fieldValue.value}
              onIonChange={(e) =>
                setFieldValue((prev) => ({
                  ...prev,
                  value: e.detail.value ?? "",
                }))
              }
            />
          </IonCol>
          <IonCol size="1">
            <IonButton
              fill="solid"
              style={{ height: "100%" }}
              onClick={(e) => {
                if (process.additionalData == null)
                  process.additionalData = new Map<string, string>();
                if(fieldValue.field && fieldValue.value) {
                  process.additionalData.set(fieldValue.field, fieldValue.value);
                  setProcess((prev) => ({
                    ...prev,
                    additionalData: process.additionalData,
                  }));
                  setFieldValue({ field: "", value: "" });
                }
              }}
            >
              <IonIcon icon={checkmarkSharp}></IonIcon>
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
      <IonList>
        {process?.additionalData &&
          Array.from(process.additionalData).map(([field, value], index) => (
            <IonItem key={index}>
              <IonLabel>
                {field}: {value}
              </IonLabel>
              <IonButtons slot="end">
                <IonButton
                  fill="clear"
                  color="danger"
                  onClick={(e) => {
                    process.additionalData?.delete(field);
                    setProcess((prev) => ({
                      ...prev,
                      additionalData: process.additionalData,
                    }));
                  }}
                >
                  <IonIcon icon={closeSharp}></IonIcon>
                </IonButton>
              </IonButtons>
            </IonItem>
          ))}
      </IonList>
    </>
  );
};