import {
  IonToolbar,
  IonLabel,
  IonButtons,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
} from "@ionic/react";
import {
  closeSharp,
} from "ionicons/icons";
import { changeProcessAtom } from "./ChangeProcessModal";
import { useAtom } from "jotai";
import { AdditionalInformationForm } from "./Forms/AdditionalInformationForm";

export const ProcessAdditionalDataForm = () => {
  const [process, setProcess] = useAtom(changeProcessAtom);

  return (
    <>
      <IonToolbar>
        <IonLabel>Dados Adicionais do processo</IonLabel>
      </IonToolbar>
      <AdditionalInformationForm
        field={""}
        value={""}
        onAdd={(field, value) => {
          if (process.additionalData == null)
            process.additionalData = new Map<string, string>();

          if (field && value) {
            process.additionalData.set(field, value);

            setProcess((prev) => ({
              ...prev,
              additionalData: process.additionalData,
            }));
          }
        }}
      />
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
