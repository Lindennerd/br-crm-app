import {
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useState } from "react";
import { ClientField, FieldConfiguration } from "../../types/app.types";

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
    setFilters((prev) => {
      if (!prev) prev = [];
      const fieldValue = prev?.find(
        (it) => it.field.name === selectedField!.name
      );
      if (fieldValue) {
        fieldValue.value = value.toString();
      } else {
        prev?.push({
          field: selectedField!,
          value: value.toString(),
        });
      }
      return prev;
    });
  };

  const getFieldJsx = () => {
    switch (selectedField!.type) {
      case 0:
        return (
          <IonItem key={selectedField!.name}>
            <IonLabel position="fixed">{selectedField!.name}</IonLabel>
            {selectedField!.possibleValues?.every((it) => it === "") ? (
              <IonInput
                type="text"
                value={getFieldValue()}
                onIonChange={(e) => setFieldValue(e.target.value ?? "")}
              ></IonInput>
            ) : (
              <IonSelect
                interface="popover"
                value={getFieldValue()}
                onIonChange={(e) => setFieldValue(e.target.value ?? "")}
              >
                {selectedField!.possibleValues?.map((f) => (
                  <IonSelectOption key={f} value={f}>
                    {f}
                  </IonSelectOption>
                ))}
              </IonSelect>
            )}
          </IonItem>
        );
      case 1:
        return (
          <IonItem key={selectedField!.name}>
            <IonLabel position="floating">{selectedField!.name}</IonLabel>
            <IonInput
              type="number"
              value={getFieldValue()}
              onIonChange={(e) => setFieldValue(e.target.value ?? "")}
            ></IonInput>
          </IonItem>
        );
      case 2:
        return (
          <IonItem key={selectedField!.name}>
            <IonLabel position="floating">{selectedField!.name}</IonLabel>
            <IonDatetime
              value={getFieldValue()}
              onIonChange={(e) =>
                setFieldValue(e.target.value?.toString() ?? "")
              }
            ></IonDatetime>
          </IonItem>
        );
      // eslint-disable-next-line
      default:
        return (
          <IonItem key={selectedField!.name}>
            <IonLabel position="floating">{selectedField!.name}</IonLabel>
            <IonInput
              type="text"
              value={getFieldValue()}
              onIonChange={(e) => setFieldValue(e.target.value ?? "")}
            ></IonInput>
          </IonItem>
        );
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
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
              onClick={(e) => onDismiss(null, "apply")}
            >
              Salvar
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonListHeader>
            <IonLabel>Filtros Atuais</IonLabel>
          </IonListHeader>
          {filters?.map((filter) => (
            <IonItem key={filter.field.name}>
              <IonLabel key={filter.field.name}>
                {filter.field.name}: {filter.value}
              </IonLabel>
            </IonItem>
          ))}
        </IonList>

        <IonList>
          <IonListHeader>
            <IonLabel>Adicionar Filtros</IonLabel>
          </IonListHeader>
          <IonItem>
            <IonSelect
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
            {selectedField && getFieldJsx()}
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};
