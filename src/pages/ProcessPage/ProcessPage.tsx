import { useEffect, useState } from "react";
import {
  processAtom,
  useProcessPageController,
} from "./ProcessPage.Controller";
import { createStore, useAtom } from "jotai";
import { IonList, IonLoading, useIonModal } from "@ionic/react";
import { ProcessToolbar } from "../../components/Process/ProcessToolbar";
import {
  ChangeProcessModal,
  ChangeProcessModalProps,
} from "../../components/Process/ChangeProcessModal";
import { Process } from "../../types/app.types";
import {
  ProcessFilter,
  ProcessFilterProps,
} from "../../components/Process/ProcessFilter";
import "./processPage.css";
import { useEffectOnce } from "../../common/useEffectOnce";
import { ProcessItem } from "../../components/Process/ProcessItem";

export const ProcessPage = () => {
  const [state] = useAtom(processAtom);
  const controller = useProcessPageController();

  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
  const [filters, setFilters] = useState<[]>([]);

  const [addProcessModal, dismissAddProcessModal] = useIonModal(
    ChangeProcessModal,
    {
      process: selectedProcess,
      onDismiss: (data, action) => {
        if (action === "add" && data) {
          console.log("add");
          controller.add(data);
        }
        if (action === "edit" && data) {
          console.log("edit");

          controller.add(data);
        }
        setSelectedProcess(null);
        dismissAddProcessModal();
      },
    } as ChangeProcessModalProps
  );

  const [filterProcessModal, dismissFilterProcessModal] = useIonModal(
    ProcessFilter,
    {
      filters: filters,
      onDismiss: (data, action) => {
        if (action === "add" && data) setFilters(data);
        if (action === "remove" && data) setFilters([]);
        dismissFilterProcessModal();
      },
    } as ProcessFilterProps
  );

  useEffectOnce(() => {
    controller.load();
  });

  return (
    <>
      <IonLoading isOpen={state.loading} message="Carregando processos..." />
      <ProcessToolbar
        handleSearch={(e) => controller.search(e.detail.value)}
        handleAddProcess={addProcessModal}
        handleFilter={filterProcessModal}
        currentFilterCount={filters.length}
      />
      <IonList>
        {state.processes.map((process) => (
          <ProcessItem 
            onSelectProcess={(process) => setSelectedProcess(process)}
            onViewEvents={(process) => console.log("view events")}
            onViewTasks={(process) => console.log("view tasks")}
            key={process.id}
            process={process}
          />
        ))}
      </IonList>
    </>
  );
};
