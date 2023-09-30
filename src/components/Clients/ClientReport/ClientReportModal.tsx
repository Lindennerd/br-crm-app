import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonToolbar,
} from "@ionic/react";
import { caretBackOutline, printSharp } from "ionicons/icons";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { useGetProcesses } from "../../../api/useProcessApi";
import { useClient } from "../../../common/useClient";
import { Client, FieldConfiguration } from "../../../types/app.types";
import { ReportTable } from "./ReportTable";

import "./ClientReport.css";

export interface ClientReportModalProps {
  client: Client;
  onDismiss: () => void;
}

export const ClientReportModal = (props: ClientReportModalProps) => {
  const [fieldConfiguration, setFieldConfiguration] = useState<
    FieldConfiguration[]
  >([]);
  const { inferConfigurationFromClient } = useClient();
  const { data: processes } = useGetProcesses({
    clientId: props.client.id,
    page: 1,
    pageSize: 1000,
  });

  const tableRef: MutableRefObject<HTMLTableElement | null> =
    useRef<HTMLTableElement | null>(null);

  useEffect(() => {
    if (props.client) {
      setFieldConfiguration(inferConfigurationFromClient(props.client));
    }
  }, [props.client]);

  function handlePrint() {
    window.print();
  }

  // const handlePrint = useReactToPrint({
  //   copyStyles: true,
  //   pageStyle: `./ClientReport.css`,
  //   content: () => {
  //     console.log(tableRef.current);
  //     return tableRef.current;
  //   },
  // });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="secondary">
          <IonButton
            fill="clear"
            color="light"
            onClick={(e) => props.onDismiss()}
          >
            <IonIcon icon={caretBackOutline}></IonIcon>
          </IonButton>
          <IonButtons slot="end" style={{ padding: ".5rem" }}>
            <IonButton
              fill="solid"
              color="tertiary"
              onClick={(e) => handlePrint()}
            >
              <IonIcon icon={printSharp}></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {processes && (
          <ReportTable
            ref={tableRef}
            fieldConfiguration={fieldConfiguration}
            client={props.client}
            processes={processes?.pages.flatMap((p) => p)}
          />
        )}
      </IonContent>
    </IonPage>
  );
};
