import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { trashBinSharp } from "ionicons/icons";
import { useState } from "react";
import { ClientField, FieldConfiguration } from "../../types/app.types";
import { ClientForm } from "./ClientForm";

export type ClientFiltersModalParams = {
  currentFilters: ClientField[] | null;
  fields: FieldConfiguration[];
  onDismiss: (data: ClientField[] | null, action: ClientFiltersAction) => void;
};

export type ClientFiltersAction = "apply" | "cancel";

export const ClientFiltersModal = ({
  currentFilters,
  fields,
  onDismiss,
}: ClientFiltersModalParams) => {
  const [filters, setFilters] = useState<ClientField[]>(currentFilters ?? []);
  const [selectedField, setSelectedField] = useState<FieldConfiguration | null>(
    null
  );

  const getFieldValue = () => {
    const fieldValue = filters?.find(
      (it) => it.field.name === selectedField!.name
    );
    return fieldValue?.value ?? "";
  };

  const setFieldValue = (value: string | number) => {
    const newFilters = filters.filter(
      (it) => it.field.name !== selectedField!.name
    );
    setFilters([...newFilters, { field: selectedField!, value }]);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="secondary">
          <IonButtons slot="start">
            <IonButton
              color="medium"
              onClick={(e) => onDismiss(null, "cancel")}
            >
              Cancelar
            </IonButton>
          </IonButtons>
          <IonTitle>Gerenciar Filtros</IonTitle>
          <IonButtons slot="end">
            <IonButton
              color="success"
              fill="clear"
              onClick={(e) => onDismiss(filters, "apply")}
            >
              Salvar
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol size="10">
              <IonSelect
                fill="solid"
                interface="popover"
                value={selectedField?.name}
                onIonChange={(e) =>
                  setSelectedField(
                    fields.find((f) => f.name === e.target.value) ?? null
                  )
                }
              >
                {fields.map((field) => (
                  <IonSelectOption value={field.name} key={field.name}>
                    {field.name}
                  </IonSelectOption>
                ))}
              </IonSelect>
              {selectedField && (
                <ClientForm
                  selectedField={selectedField}
                  getFieldValue={getFieldValue}
                  setFieldValue={setFieldValue}
                />
              )}
            </IonCol>
            <IonCol>
              <IonButton>
                <IonLabel>Adicionar</IonLabel>
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonList>
          <IonListHeader>
            <IonLabel>Filtros Atuais</IonLabel>
          </IonListHeader>
          {filters?.map((filter) => (
            <IonItem key={filter.field.name}>
              <IonLabel key={filter.field.name}>
                {filter.field.name}: {filter.value}
              </IonLabel>
              <IonButtons slot="end">
                <IonButton
                  onClick={(e) => {
                    const newFilters = filters.filter(
                      (it) => it.field.name !== filter.field.name
                    );
                    setFilters(newFilters);
                  }}
                >
                  <IonIcon icon={trashBinSharp} color="danger" />
                </IonButton>
              </IonButtons>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};
