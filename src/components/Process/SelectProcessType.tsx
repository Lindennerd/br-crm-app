import { IonSelect, IonSelectOption } from "@ionic/react";
import { ProcessConfiguration } from "../../types/app.types";
import { useState } from "react";

export interface SelectProcessTypeProps {
    processTypes: ProcessConfiguration[];
    onSelected: (processType: ProcessConfiguration) => void;
}

export const SelectProcessType = (props: SelectProcessTypeProps) => {
    const [selectedProcessType, setSelectedProcessType] = useState<ProcessConfiguration>({} as ProcessConfiguration);

    function handleSetSelectedProcessType(processType: ProcessConfiguration) {
        setSelectedProcessType(processType);
        props.onSelected(processType);
    }

    return (
        <IonSelect
            label="Selecione o tipo de processo"
            labelPlacement="floating"
            interface="popover"
            onIonChange={(e) => handleSetSelectedProcessType(e.detail.value)}
            value={selectedProcessType}
        >
            {props.processTypes.map((processType) => (
                <IonSelectOption key={processType.id} value={processType}>
                    {processType.title}
                </IonSelectOption>
            ))}
        </IonSelect>
    );
}