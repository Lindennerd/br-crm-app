import { IonSelect, IonSelectOption } from "@ionic/react";
import { ProcessConfiguration } from "../../types/app.types";

export interface SelectProcessTypeProps {
    processTypes: ProcessConfiguration[];
    defaultValue: ProcessConfiguration | null | undefined;
    onSelected: (processType: ProcessConfiguration) => void;
}

export const SelectProcessType = (props: SelectProcessTypeProps) => {
    return (
        <IonSelect
            label="Selecione o tipo de processo"
            labelPlacement="floating"
            interface="popover"
            onIonChange={(e) => props.onSelected(e.detail.value!)}
            value={props.defaultValue}
        >
            {props.processTypes.map((processType) => (
                <IonSelectOption key={processType.id} value={processType}>
                    {processType.title}
                </IonSelectOption>
            ))}
        </IonSelect>
    );
}