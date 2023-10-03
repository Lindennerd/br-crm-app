import { IonButton, IonFooter, IonList, useIonModal } from "@ionic/react";
import { useState } from "react";
import { useGetProcesses } from "../../api/useProcessApi";
import { useRouter } from "../../common/useRouter";
import {
  ChangeProcessModal,
  ChangeProcessModalProps,
} from "../../components/Process/ChangeProcessModal";
import { ProcessItem } from "../../components/Process/ProcessItem";
import { ProcessToolbar } from "../../components/Process/ProcessToolbar";
import { ProcessFilter } from "../../types/app.types";
import "./processPage.css";

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

  const [addProcessModal, dismissAddProcessModal] = useIonModal(
    ChangeProcessModal,
    {
      onDismiss: (data, action) => {
        dismissAddProcessModal();
      },
    } as ChangeProcessModalProps
  );

  function handleSearch(value: string) {
    if (value.length > 2 || value === "")
      setProcessFilters((prev) => ({
        ...prev,
        clientName: value,
        title: value,
      }));
  }

  if (!processes) return <></>;

  return (
    <>
      <ProcessToolbar
        searchText={processFilters.clientName || ""}
        handleSearch={(e) => handleSearch(e.detail.value!)}
        handleAddProcess={() =>
          addProcessModal({
            keyboardClose: false,
            backdropDismiss: false,
          })
        }
      />
      <IonList>
        {processes?.pages.map((page) =>
          page.map((process) => (
            <ProcessItem
              key={process.id}
              process={process}
              goToProcess={gotoProcess}
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
