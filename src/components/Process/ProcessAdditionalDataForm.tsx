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
import { useMapUtils } from "../../api/useMapUtils";

export const ProcessAdditionalDataForm = () => {
  const [process, setProcess] = useAtom(changeProcessAtom);
  const {ensureItsMap} = useMapUtils();

  return (
    <>
      <AdditionalInformationForm
        field={""}
        value={""}
        onAdd={(field, value) => {
          if (process.additionalData == null)
            process.additionalData = new Map<string, string>();

          process.additionalData = ensureItsMap(process.additionalData);
          if (field) {
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
