import {
  IonList,
  IonListHeader,
  IonIcon,
  IonTitle,
  IonItem,
  IonLabel,
  IonButton,
  IonProgressBar,
  IonCheckbox,
} from "@ionic/react";
import {
  addCircleSharp,
  addSharp,
  caretForwardSharp,
  close,
} from "ionicons/icons";
import { ProcessTask } from "../../../types/app.types";
import { useEffect, useState } from "react";
import { AddTaskForm } from "../Forms/AddTaskForm";

export interface ProcessTasksListProps {
  tasks: ProcessTask[];
  onTaskChange: (task: ProcessTask) => void;
  setCompletedTask: (task: ProcessTask) => void;
}

export const ProcessTasksList = (props: ProcessTasksListProps) => {
  const [showAddTaskForm, setShowAddTaskForm] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const completedTasks = props.tasks.filter((task) => task.isCompleted);
    const totalTasks = props.tasks.length;
    setProgress(completedTasks.length / totalTasks);
  }, [props.tasks]);

  const addForm = () => {
    return (
      <AddTaskForm
        task={""}
        onTaskChange={(task) =>
          props.onTaskChange({
            title: task,
            isCompleted: false,
            completedAt: null,
            createdAt: new Date(),
            id: null,
          })
        }
      />
    );
  };

  function setCompletedTask(task: ProcessTask): void {
    props.setCompletedTask(task);
  }

  const styleCompletedTask = {
    textDecoration: "line-through",
  };

  return (
    <IonList lines="full">
      <IonListHeader color="secondary">
        <IonIcon icon={caretForwardSharp} />
        <IonTitle>Tarefas</IonTitle>
        <IonButton
          fill="clear"
          color="light"
          style={{ marginRight: "1em" }}
          onClick={(e) => setShowAddTaskForm(!showAddTaskForm)}
        >
          <IonIcon icon={showAddTaskForm ? close : addSharp} />
        </IonButton>
      </IonListHeader>
      <IonProgressBar color="tertiary" value={progress} />
      {showAddTaskForm && (
        <IonItem>
          <IonIcon slot="start" icon={addCircleSharp} />
          <div style={{ width: "100%" }}>{addForm()}</div>
        </IonItem>
      )}
      {props.tasks.length === 0 && (
        <IonItem>
          <IonLabel>Nenhuma tarefa encontrada</IonLabel>
        </IonItem>
      )}
      {props.tasks.map((task, index) => (
        <IonItem>
          <IonCheckbox
            style={task.isCompleted ? styleCompletedTask : {}}
            checked={task.isCompleted}
            onIonChange={(e) => setCompletedTask(task)}
          >
            {task.title}
          </IonCheckbox>
        </IonItem>
      ))}
    </IonList>
  );
};
