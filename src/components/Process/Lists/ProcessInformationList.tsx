import {
  IonList,
  IonListHeader,
  IonIcon,
  IonTitle,
  IonButton,
  IonItem,
  IonLabel,
} from "@ionic/react";
import { newspaper, addSharp, addCircleSharp, close } from "ionicons/icons";
import { useState } from "react";
import { AdditionalInformationForm } from "../Forms/AdditionalInformationForm";

export interface ProcessInformationListProps {
  additionalData: { [key: string]: string};
  onAdd: (field: string, value: string) => void;
}

export const ProcessInformationList = (props: ProcessInformationListProps) => {
  const [showAddForm, setShowAddForm] = useState(false);

  const addForm = () => {
    return <AdditionalInformationForm onAdd={props.onAdd} />;
  };

  return (
    <IonList lines="full">
      <IonListHeader color="secondary">
        <IonIcon icon={newspaper} />
        <IonTitle>Informações</IonTitle>
        <IonButton
          fill="clear"
          color="light"
          style={{ marginRight: "1em" }}
          onClick={(e) => setShowAddForm(!showAddForm)}
        >
          <IonIcon icon={showAddForm ? close : addSharp} />
        </IonButton>
      </IonListHeader>
      {showAddForm && (
        <IonItem>
          <IonIcon slot="start" icon={addCircleSharp}/>
          {addForm()}
        </IonItem>
      )}
      {Object.keys(props.additionalData).map((data, index) => (
        <IonItem key={index}>
          <IonLabel>
            {data}: {props.additionalData[data]}
          </IonLabel>
        </IonItem>
      ))}
    </IonList>
  );
};
