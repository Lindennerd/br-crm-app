import {
  IonButton,
  IonButtons,
  IonIcon,
  IonSearchbar,
  IonToolbar,
  SearchbarCustomEvent,
} from "@ionic/react";
import { addSharp, filterSharp, searchSharp } from "ionicons/icons";

export type ProcessToolbarProps = {
  handleSearch: (event: SearchbarCustomEvent) => void;
  handleAddProcess: () => void;

};

export const ProcessToolbar = (props: ProcessToolbarProps) => {
  return (
    <IonToolbar color="secondary">
      <IonSearchbar
        class="custom"
        showClearButton="always"
        placeholder="Pesquisar por nome do cliente ou nome do processo"
        onIonChange={props.handleSearch}
        animated={true}
      />
      <IonButtons slot="end">
        <IonButton color="tertiary" fill="solid">
          <IonIcon icon={searchSharp} />
        </IonButton>
        <IonButton
          color="tertiary"
          fill="solid"
          onClick={(_) => props.handleAddProcess()}
        >
          <IonIcon icon={addSharp}></IonIcon>
        </IonButton>
      </IonButtons>
    </IonToolbar>
  );
};
