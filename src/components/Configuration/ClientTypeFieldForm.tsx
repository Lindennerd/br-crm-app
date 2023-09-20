import {
  IonInput,
  IonSelect,
  IonSelectOption,
  IonCheckbox,
  IonList,
  IonButton,
  IonButtons,
} from "@ionic/react";
import { useState } from "react";
import { FieldConfiguration } from "../../types/app.types";

export interface ClientTypeFieldFormProps {
  onSave: (field: FieldConfiguration) => void;
  order: number;
}

export const ClientTypeFieldForm = (props: ClientTypeFieldFormProps) => {
  const defaultState = {
    name: "",
    type: 0,
    defaultValue: "",
    possibleValues: [],
    required: false,
    order: 1,
  };

  const [field, setField] = useState<FieldConfiguration>(defaultState);

  function resetForm() {
    setField(defaultState);
  }

  function handleSave() {
    if (field.name == null || field.name == "") return;
    if (field.type == null) return;
    props.onSave(field);
    resetForm();
  }

  return (
    <div style={{ width: "100%", padding: "1rem" }}>
      <IonInput
        color={field.name == null || field.name == "" ? "danger" : ""}
        
        style={{ marginBottom: "1em", borderBottom: "1px solid #eee" }}
        type="text"
        placeholder="Nome do tipo de campo"
        label="Nome"
        labelPlacement="stacked"
        value={field.name}
        onIonInput={(e) => {
          setField({ ...field, name: e.detail.value! })
        }}
      />
      <IonSelect
        color={field.name == null || field.name == "" ? "danger" : ""}
        style={{ marginBottom: "1em", borderBottom: "1px solid #eee" }}
        label="Tipo do campo"
        labelPlacement="stacked"
        interface="popover"
        selectedText={field.type == 0 ? "Texto" : field.type == 1 ? "Número" : "Data"}
        onIonChange={(e) =>
          setField({ ...field, type: Number(e.detail.value) })
        }
      >
        <IonSelectOption value="0">Texto</IonSelectOption>
        <IonSelectOption value="1">Número</IonSelectOption>
        <IonSelectOption value="2">Data</IonSelectOption>
      </IonSelect>
      <IonInput
        style={{ marginBottom: "1em", borderBottom: "1px solid #eee" }}
        label="Valor Padrão"
        labelPlacement="stacked"
        value={field.defaultValue}
        onIonChange={(e) =>
          setField({ ...field, defaultValue: e.detail.value! })
        }
      />
      <IonInput
        style={{ marginBottom: "1em", borderBottom: "1px solid #eee" }}
        label="Valores Possíveis"
        labelPlacement="stacked"
        placeholder="Valores separados por vírgula"
        value={field.possibleValues?.join(",")}
        onIonChange={(e) =>
          setField({
            ...field,
            possibleValues: e.detail.value!.split(","),
          })
        }
      />

      <IonCheckbox
        style={{ marginBottom: "1em", borderBottom: "1px solid #eee" }}
        checked={field.required}
        onIonChange={(e) => setField({ ...field, required: e.target.checked })}
      >
        Obrigatório?
      </IonCheckbox>
      <IonInput
        style={{ marginBottom: "1em", borderBottom: "1px solid #eee" }}
        label="Ordem"
        labelPlacement="stacked"
        type="number"
        min={1}
        value={props.order}
        onIonChange={(e) =>
          setField({ ...field, order: Number(e.detail.value!) })
        }
      />
      <IonButtons>
        <IonButton color="success" fill="solid" onClick={(e) => handleSave()}>
          Adicionar Campo
        </IonButton>
      </IonButtons>
    </div>
  );
};
