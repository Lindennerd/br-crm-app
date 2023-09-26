import { useState } from "react";
import {
  processAtom,
  useProcessPageController,
} from "./ProcessPage.Controller";
import { useAtom } from "jotai";
import { IonButton, IonFooter, IonList, useIonModal } from "@ionic/react";
import { ProcessToolbar } from "../../components/Process/ProcessToolbar";
import {
  ChangeProcessModal,
  ChangeProcessModalProps,
} from "../../components/Process/ChangeProcessModal";
import { Process, ProcessFilter } from "../../types/app.types";
import {
  ProcessFilter as ProcessFilterModal,
  ProcessFilterProps,
} from "../../components/Process/ProcessFilter";
import "./processPage.css";
import { useEffectOnce } from "../../common/useEffectOnce";
import { ProcessItem } from "../../components/Process/ProcessItem";
import { useRouter } from "../../common/useRouter";
import { useLoadingContext } from "../../context/LoadingContext";
import { useCurrentClientContext } from "../../context/CurrentClientContext";
import { useGetProcesses } from "../../api/useProcessApi";

export const ProcessPage = () => {
  const [processFilters, setProcessFilters] = useState<Partial<ProcessFilter>>({
    page: 1,
  });
  const {
    data: processes,
    hasNextPage,
    fetchNextPage,
  } = useGetProcesses(processFilters);

  const { gotoProcess } = useRouter();
  const [filters, setFilters] = useState<[]>([]);

  const [addProcessModal, dismissAddProcessModal] = useIonModal(
    ChangeProcessModal,
    {
      onDismiss: (data, action) => {
        dismissAddProcessModal();
      },
    } as ChangeProcessModalProps
  );

  // const [filterProcessModal, dismissFilterProcessModal] = useIonModal(
  //   ProcessFilterModal,
  //   {
  //     filters: filters,
  //     onDismiss: (data, action) => {
  //       if (action === "add" && data) setFilters(data);
  //       if (action === "remove" && data) setFilters([]);
  //       dismissFilterProcessModal();
  //     },
  //   } as ProcessFilterProps
  // );

  function handleSearch(value: string) {
    setProcessFilters((prev) => ({ ...prev, clientName: value, title: value }));
  }

  if (!processes) return <></>;

  return (
    <>
      <ProcessToolbar
        handleSearch={(e) => handleSearch(e.detail.value!)}
        handleAddProcess={() =>
          addProcessModal({
            keyboardClose: false,
            backdropDismiss: false,
          })
        }
        handleFilter={() => console.log("filter")}
        currentFilterCount={filters.length}
      />
      <IonList>
        {processes?.pages.map((page) =>
          page.map((process) => (
            <ProcessItem
              key={process.id}
              onSelectProcess={(process) => gotoProcess(process.id)}
              process={process}
            />
          ))
        )}
      </IonList>
      <IonFooter class="clients-footer">
        <IonButton
          style={{ width: "100%" }}
          fill="clear"
          disabled={!hasNextPage}
          onClick={(e) => fetchNextPage()}
        >
          Carregar mais
        </IonButton>
      </IonFooter>
    </>
  );
};
