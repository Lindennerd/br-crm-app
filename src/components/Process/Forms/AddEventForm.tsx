import {
  IonButton,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonTextarea,
} from "@ionic/react";
import {
  ProcessEvent,
  ProcessStatus,
  ProcessStatusText,
} from "../../../types/app.types";
import { useState } from "react";
import { addSharp } from "ionicons/icons";

export interface AddTaskFormProps {
  event: ProcessEvent;
  onEventChange: (event: ProcessEvent) => void;
}

export const AddEventForm = (props: AddTaskFormProps) => {
  const [edittingEvent, setEdittingEvent] = useState<ProcessEvent>(props.event);

  return (
    <>
      <IonTextarea
        style={{ padding: "0.5em" }}
        fill="solid"
        color="primary"
        label="Descrição"
        labelPlacement="floating"
        placeholder="Descreva o evento"
        value={edittingEvent.description}
        onIonChange={(e) => {
          debugger;
          setEdittingEvent({
            ...edittingEvent,
            description: e.detail.value ?? "",
          });
        }}
      />
      <IonSelect
        interface="popover"
        labelPlacement="floating"
        label="Tipo de Evento"
        value={edittingEvent.eventType}
        onIonChange={(e) =>
          setEdittingEvent({
            ...edittingEvent,
            eventType: e.detail.value ?? ProcessStatus.Waiting,
          })
        }
      >
        {Array.from(ProcessStatusText).map(([status, description], index) => (
          <IonSelectOption key={index} value={status}>
            {description}
          </IonSelectOption>
        ))}
      </IonSelect>
      <IonButton
        color="primary"
        onClick={(e) => {
          props.onEventChange(edittingEvent);
          setEdittingEvent({
            ...edittingEvent,
            description: "",
            eventType: ProcessStatus.Waiting,
          });
        }}
      >
        <IonIcon icon={addSharp} />
      </IonButton>
    </>
  );
};
