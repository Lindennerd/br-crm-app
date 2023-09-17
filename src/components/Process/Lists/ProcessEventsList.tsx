import {
  IonList,
  IonListHeader,
  IonIcon,
  IonTitle,
  IonButton,
  IonItemDivider,
  IonItem,
  IonLabel,
  IonBadge,
} from "@ionic/react";
import {
  flagSharp,
  addSharp,
  sadSharp,
  checkmarkCircleSharp,
  playCircle,
  pin,
  close,
} from "ionicons/icons";
import { ProcessEvent, ProcessStatus } from "../../../types/app.types";
import { useProcessPageController } from "../../../pages/ProcessPage/ProcessPage.Controller";
import { useState } from "react";
import { AddEventForm } from "../Forms/AddEventForm";
import { useProcessApi } from "../../../api/useProcessApi";
import { ProcessStatusBadge } from "../ProcessStatusBadge";

export interface ProcessEventsListProps {
  events: ProcessEvent[];
  onEventChange: (event: ProcessEvent) => void;
}

export const ProcessEventsList = (props: ProcessEventsListProps) => {

  const [showAddForm, setShowAddForm] = useState(false);

  const defaultEvent: ProcessEvent = {
    description: "",
    eventType: ProcessStatus.Waiting,
    id: null,
    createdAt: new Date(),
  };

  const addForm = () => {
    return (
      <AddEventForm event={defaultEvent} onEventChange={props.onEventChange} />
    );
  };

  return (
    <IonList lines="full">
      <IonListHeader color="tertiary">
        <IonIcon icon={flagSharp} />
        <IonTitle>Eventos</IonTitle>
        <IonButton
          fill="clear"
          color="light"
          style={{ marginRight: "1em" }}
          onClick={(e) => setShowAddForm(!showAddForm)}
        >
          <IonIcon icon={showAddForm ? close : addSharp} />
        </IonButton>
      </IonListHeader>
      {showAddForm && <IonItem color="light">{addForm()}</IonItem>}
      {props.events.map((event, index) => (
        <IonItem key={index}>
          {event.eventType == ProcessStatus.Blocked && (
            <IonIcon slot="start" icon={sadSharp} color="danger" />
          )}
          {event.eventType == ProcessStatus.Done && (
            <IonIcon slot="start" icon={checkmarkCircleSharp} color="success" />
          )}
          {event.eventType == ProcessStatus.InProgress && (
            <IonIcon slot="start" icon={playCircle} color="warning" />
          )}
          {event.eventType == ProcessStatus.Waiting && (
            <IonIcon slot="start" icon={pin} color="primary" />
          )}
          <IonLabel>
            {new Date(event.createdAt).toLocaleString()} - {event.description}{" "}
          </IonLabel>
          <ProcessStatusBadge status={event.eventType} slot="end"/>
        </IonItem>
      ))}
    </IonList>
  );
};
