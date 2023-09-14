import { IonSelect, IonSelectOption } from "@ionic/react";
import { FieldConfiguration } from "../../types/app.types"

export interface SelectClientFieldProps {
    fields: FieldConfiguration[];
    onSelected: (field: FieldConfiguration) => void;
}

export const SelectClientField = (props: SelectClientFieldProps) => {
    return (
        <IonSelect
            label="Selecione o Campo"
            labelPlacement="floating"
            interface="popover"
            onIonChange={(e) => props.onSelected(e.detail.value!)}
        >
            {props.fields.map((field) => {
                if (field.type === 0)
                    return (
                        <IonSelectOption key={field.name} value={field}>
                            {field.name}
                        </IonSelectOption>
                    );
            })}
        </IonSelect>
    );
}