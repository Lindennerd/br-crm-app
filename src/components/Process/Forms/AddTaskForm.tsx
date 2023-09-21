import {
  IonItem,
  IonInput,
  IonButtons,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { addSharp } from "ionicons/icons";
import { useState } from "react";

export interface AddTaskFormProps {
  task: string;
  onTaskChange: (task: string) => void;
}

export const AddTaskForm = (props: AddTaskFormProps) => {
    const [edittingTask, setEdittingTask] = useState<string>(props.task);

  return (
    <IonItem>
      <IonInput
        label="Novo item"
        labelPlacement="floating"
        value={edittingTask}
        onIonInput={(e) => setEdittingTask(e.detail.value ?? "")}
        onKeyDown={(e) => e.key === "Enter" && props.onTaskChange(edittingTask)}
      />
      <IonButtons slot="end">
        <IonButton
          fill="solid"
          color="primary"
          onClick={(e) => {
            e.stopPropagation();
            props.onTaskChange(edittingTask)
          }}
        >
          <IonIcon icon={addSharp}></IonIcon>
        </IonButton>
      </IonButtons>
    </IonItem>
  );
};
