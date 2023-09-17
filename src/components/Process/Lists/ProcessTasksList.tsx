import {
  IonList,
  IonListHeader,
  IonIcon,
  IonTitle,
  IonItem,
  IonLabel,
  IonButtons,
  IonButton,
  IonProgressBar,
} from "@ionic/react";
import {
  add,
  addCircleSharp,
  addSharp,
  caretForwardSharp,
  close,
} from "ionicons/icons";
import { Process, ProcessTask } from "../../../types/app.types";
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
    console.log(props.tasks);
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

  return (
    <IonList lines="full">
      <IonListHeader color="tertiary">
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
      <IonProgressBar color="primary" value={progress} />
      {showAddTaskForm && (
        <IonItem color="light">
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
        <IonItem
        key={index}
        button
        color={task.isCompleted ? "medium" : ""}
        onClick={(e) => setCompletedTask(task)}
        >
          <IonIcon icon={caretForwardSharp} slot="start" />
          <IonLabel>{task.title}</IonLabel>
        </IonItem>
      ))}
    </IonList>
  );
};
