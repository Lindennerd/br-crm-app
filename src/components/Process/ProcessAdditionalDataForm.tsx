import {
  IonLabel,
  IonButtons,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
} from "@ionic/react";
import { closeSharp } from "ionicons/icons";
import { AdditionalInformationForm } from "./Forms/AdditionalInformationForm";
import { Process } from "../../types/app.types";

export interface ProcessAdditionalDataFormProps {
  process: Process | null;
  addAdditionalData: (field: string, value: string) => void;
  removeAdditionalData: (field: string) => void;
}

export const ProcessAdditionalDataForm = (
  props: ProcessAdditionalDataFormProps
) => {
  return (
    <>
      <AdditionalInformationForm
        onAdd={(field, value) => props.addAdditionalData(field, value)}
      />
      <IonList>
        {props.process?.additionalData &&
          Object.keys(props.process?.additionalData).map((p, index) => (
            <IonItem key={index}>
              <IonLabel>{`${p}: ${props.process?.additionalData[p]}`}</IonLabel>
              <IonButtons slot="end">
                <IonButton
                  fill="clear"
                  color="danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    props.removeAdditionalData(p);
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
