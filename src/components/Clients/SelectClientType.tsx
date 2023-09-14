import { IonSelect, IonSelectOption } from "@ionic/react";
import { ClientConfiguration } from "../../types/app.types";

export interface SelectClientTypeProps {
  clientTypes: ClientConfiguration[];
  onSelected: (clientType: ClientConfiguration) => void;
}

export const SelectClientType = (props: SelectClientTypeProps) => {
  return (
    <IonSelect
      label="Selecione o tipo de cliente"
      labelPlacement="floating"
      interface="popover"
      onIonChange={(e) => {
        props.onSelected(e.detail.value!);
    }}
    >
      {props.clientTypes.map((clientConfiguration) => (
        <IonSelectOption
          key={clientConfiguration.id}
          value={clientConfiguration}
        >
          {clientConfiguration.name}
        </IonSelectOption>
      ))}
    </IonSelect>
  );
};
