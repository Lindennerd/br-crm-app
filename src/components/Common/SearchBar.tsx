import {
  IonButton,
  IonButtons,
  IonIcon,
  IonInput,
  IonItem,
} from "@ionic/react";
import { searchSharp } from "ionicons/icons";
import React from "react";

export interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  defaultValue?: string;
  label: string;
  placeholder: string;
  disabled: boolean;
}

export const SearchBar = (props: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = React.useState<string>(props.defaultValue ?? "");

  return (
    <IonItem>
      <IonInput
        disabled={props.disabled}
        label={props.label}
        labelPlacement="floating"
        placeholder={props.placeholder}
        value={searchTerm ?? ""}
        onIonInput={(e) => setSearchTerm(e.detail.value ?? "")}
        onKeyDown={(e) => {
          e.key === "Enter" && props.onSearch(searchTerm ?? "");
        }}
      />
      <IonButtons slot="end">
        <IonButton disabled={props.disabled} onClick={(e) => props.onSearch(searchTerm ?? "")}>
          <IonIcon icon={searchSharp} />
        </IonButton>
      </IonButtons>
    </IonItem>
  );
};
