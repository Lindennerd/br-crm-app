import {
  IonButton,
  IonButtons,
  IonCol,
  IonIcon,
  IonInput,
  IonRow,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { addCircleOutline, pencilOutline } from "ionicons/icons";
import { useEffect, useRef } from "react";
import { FieldConfiguration } from "../../types/app.types";

export type AddClientTypeFormParams = {
  add: (name: string) => void;
};

type AddClientTypeFormTargetType = EventTarget & {
  name: { value: string };
};

type AddConfigurationFormTargetType = EventTarget & {
  name: { value: string };
  type: { value: string };
  defaultValue: { value: string };
  possibleValues: { value: string };
};

type AddConfigurationFormParams = {
  addField: (field: FieldConfiguration, clientTypeName: string) => void;
  currentField: FieldConfiguration | undefined;
  clientTypeName: string;
};

export const AddConfigurationForm = (params: AddConfigurationFormParams) => {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (params.currentField) {
      formRef.current?.reset();
    }

    if (formRef.current) {
      (formRef.current["name"] as unknown as HTMLInputElement).value =
        params.currentField?.name ?? "";
      (formRef.current["type"] as unknown as HTMLInputElement).value =
        params.currentField?.type.toString() ?? "";
      (formRef.current["defaultValue"] as unknown as HTMLInputElement).value =
        params.currentField?.defaultValue ?? "";
      (formRef.current["possibleValues"] as unknown as HTMLInputElement).value =
        params.currentField?.possibleValues?.join(", ") ?? "";
    }
  }, []);

  const handleAddConfigurationSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as AddConfigurationFormTargetType;
    params.addField(
      {
        name: target.name.value,
        type: parseInt(target.type.value === "" ? "0" : target.type.value),
        defaultValue: target.defaultValue.value,
        possibleValues: target.possibleValues.value.split(","),
      },
      params.clientTypeName
    );
  };

  const handleClearFields = () => {
    formRef.current?.reset();
  };

  return (
    <form
      ref={formRef}
      action="POST"
      onSubmit={handleAddConfigurationSubmit}
      className="ion-padding"
    >
      <IonInput type="text" label="Nome" labelPlacement="fixed" name="name" />
      <IonSelect placeholder="Tipos" name="type">
        <IonSelectOption value="0">Texto</IonSelectOption>
        <IonSelectOption value="1">Número</IonSelectOption>
        <IonSelectOption value="2">Data</IonSelectOption>
      </IonSelect>
      <IonInput
        type="text"
        label="Valor Padrão"
        labelPlacement="fixed"
        name="defaultValue"
      />
      <IonInput
        name="possibleValues"
        type="text"
        label="Valores Possíveis"
        labelPlacement="fixed"
        placeholder="Separe os valores por vírgula"
      />
      <IonButtons>
        <IonButton color="success" type="submit">
          Adicionar
          <IonIcon icon={addCircleOutline}></IonIcon>
        </IonButton>
        <IonButton onClick={() => handleClearFields()}>Limpar</IonButton>
      </IonButtons>
    </form>
  );
};

export const AddClientTypeForm = ({ add }: AddClientTypeFormParams) => {
  async function handleAddClientTypeSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    const target = e.target as AddClientTypeFormTargetType;
    add(target.name.value);
  }

  return (
    <form action="POST" onSubmit={handleAddClientTypeSubmit}>
      <IonInput
        name="name"
        type="text"
        label="Nome do Tipo"
        labelPlacement="floating"
      />
      <IonButton type="submit">Adicionar</IonButton>
    </form>
  );
};

export const ConfigurationItem = ({
  item,
  clientTypeName,
  openForEdit,
}: {
  item: FieldConfiguration;
  clientTypeName: string;
  openForEdit: (field: FieldConfiguration, clientTypeName: string) => void;
}) => {
  function getFieldType(type: number) {
    switch (type) {
      case 0:
        return "Texto";
      case 1:
        return "Número";
      case 2:
        return "Data";
      default:
        return "Texto";
    }
  }
  return (
    <IonRow>
      <IonCol>{item.name}</IonCol>
      <IonCol>{getFieldType(item.type)}</IonCol>
      <IonCol>{item.defaultValue}</IonCol>
      <IonCol>{item.possibleValues?.join(", ")}</IonCol>
      <IonCol size="auto">
        <IonButton
          fill="clear"
          onClick={() => openForEdit(item, clientTypeName)}
        >
          <IonIcon icon={pencilOutline}></IonIcon>
        </IonButton>
      </IonCol>
    </IonRow>
  );
};
