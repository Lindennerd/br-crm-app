import { useState } from "react";
import {
  processAtom,
  useProcessPageController,
} from "./ProcessPage.Controller";
import { useAtom } from "jotai";
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
import { useRouter } from "../../common/useRouter";
import { useLoadingContext } from "../../context/LoadingContext";
import { useCurrentClientContext } from "../../context/CurrentClientContext";

export const ProcessPage = () => {
  const {setLoading} = useLoadingContext();
  const {client, setClient} = useCurrentClientContext();

  const [state] = useAtom(processAtom);
  const { gotoProcess } = useRouter();
  const controller = useProcessPageController();

  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
  const [filters, setFilters] = useState<[]>([]);

  const [addProcessModal, dismissAddProcessModal] = useIonModal(
    ChangeProcessModal,
    {
      process: selectedProcess,
      onDismiss: (data, action) => {
        if (action === "add" && data) {
          controller.add(data);
        }
        if (action === "edit" && data) {
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
    setLoading(true);
    controller.load(client)
      .catch((err) => console.log(err))
      .finally(() => {
        setClient(null);
        setLoading(false);
      });
  });

  if(!state) return <></>

  return (
    <>
      <ProcessToolbar
        handleSearch={(e) => controller.search(e.detail.value)}
        handleAddProcess={addProcessModal}
        handleFilter={filterProcessModal}
        currentFilterCount={filters.length}
      />
      <IonList>
        {state.map((process) => (
          <ProcessItem
            key={process.id}
            onSelectProcess={(process) => {
              setSelectedProcess(process);
              gotoProcess(process.id);
            }}
            onViewEvents={(process) => console.log("view events")}
            onViewTasks={(process) => console.log("view tasks")}
            process={process}
          />
        ))}
      </IonList>
    </>
  );
};
