import {
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonModal,
} from "@ionic/react";
import { caretBack, documentAttachOutline } from "ionicons/icons";

import "@ionic/react/css/ionic-swiper.css";
import { useState } from "react";
import "swiper/css";
import { useGetProcessByStatus } from "../../api/useProcessApi";
import { useRouter } from "../../common/useRouter";
import { Process } from "../../types/app.types";
import { ProcessItem } from "./ProcessItem";

export const ProcessListSlider = ({
  slidesPerView,
}: {
  slidesPerView: number;
}) => {
  const { gotoProcesses, gotoProcess } = useRouter();
  const { data: processByStatus } = useGetProcessByStatus();

  const [processesView, setProcessesView] = useState<Process[]>([]);
  const [presentModal, dismissModal] = useIonModal(ProcessViewList, {
    processes: processesView,
    onDismiss: () => {
      dismissModal();
    },
    gotoProcess: (processId: string) => {
      gotoProcess(processId);
      dismissModal();
    },
  });

  function translateStatus(status: string) {
    switch (status) {
      case "Waiting":
        return "Aguardando";
      case "InProgress":
        return "Em andamento";
      case "Blocked":
        return "Bloqueado";
      default:
        return "Outros";
    }
  }

  function groupByProcessType(processes: Process[]) {
    return processes.reduce((acc, process) => {
      const processTitle = process.title;
      if (!acc[processTitle]) {
        acc[processTitle] = [];
      }
      acc[processTitle].push(process);
      return acc;
    }, {} as { [key: string]: Process[] });
  }

  function handleViewProcessesModal(processes: Process[]) {
    setProcessesView(processes);
    presentModal();
  }

  return (
    <>
      <IonList>
        <IonListHeader>
          <IonIcon
            icon={documentAttachOutline}
            size="large"
            style={{ marginRight: "1em" }}
          />
          <IonLabel>
            <h1>Processos</h1>
          </IonLabel>
          <IonButton onClick={() => gotoProcesses()}>Ver todos</IonButton>
        </IonListHeader>
      </IonList>

      {processByStatus &&
        Object.keys(processByStatus).map((key) => (
          <>
            <IonList lines="none" key={key}>
              <IonListHeader color="secondary">
                <IonLabel>
                  <h2>{translateStatus(key)}</h2>
                </IonLabel>
              </IonListHeader>
              {Object.keys(groupByProcessType(processByStatus[key])).map(
                (processTitle, index) => {
                  return (
                    <IonItem
                      key={index}
                      button
                      detail
                      onClick={(e) =>
                        handleViewProcessesModal(
                          groupByProcessType(processByStatus[key])[processTitle]
                        )
                      }
                    >
                      <IonLabel>{processTitle}</IonLabel>
                      <IonBadge slot="start" color="warning">
                        {
                          groupByProcessType(processByStatus[key])[processTitle]
                            .length
                        }
                      </IonBadge>
                    </IonItem>
                  );
                }
              )}
            </IonList>
          </>
        ))}
    </>
  );
};

export const ProcessViewList = ({
  processes,
  onDismiss,
  gotoProcess,
}: {
  processes: Process[];
  onDismiss: () => void;
  gotoProcess: (processId: string) => void;
}) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="secondary">
          <IonButtons slot="start">
            <IonButton color="light" onClick={(e) => onDismiss()}>
              <IonIcon icon={caretBack}></IonIcon>
            </IonButton>
          </IonButtons>
          <IonTitle>Processos</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {processes.map((process) => (
          <ProcessItem
            key={process.id}
            onSelectProcess={(process) => gotoProcess(process.id)}
            process={process}
          />
        ))}
      </IonContent>
    </IonPage>
  );
};
