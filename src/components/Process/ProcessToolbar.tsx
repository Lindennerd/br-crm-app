import { IonButton, IonButtons, IonIcon, IonSearchbar, IonToolbar, SearchbarCustomEvent } from "@ionic/react"
import { addSharp, filterSharp, searchSharp } from "ionicons/icons"

export type ProcessToolbarProps = {
  handleSearch: (event: SearchbarCustomEvent) => void;
  handleAddProcess: () => void;
  handleFilter: () => void;
  currentFilterCount: number;
}

export const ProcessToolbar = (props: ProcessToolbarProps) => {

  return <IonToolbar color="primary">
    <IonSearchbar
      class="custom"
      showClearButton="always"
      placeholder="Pesquisar por nome do cliente ou nome do processo"
      onIonChange={props.handleSearch}
      animated={true}
    />
    <IonButtons slot="end">

      <IonButton color="secondary" fill="solid">
        <IonIcon icon={searchSharp} />
      </IonButton>
      <IonButton color="secondary" fill="solid" onClick={_ => props.handleAddProcess()}>
        <IonIcon icon={addSharp}></IonIcon>
      </IonButton>
      <IonButton color="secondary" fill="solid" onClick={_ => props.handleFilter()}>
        <IonIcon icon={filterSharp}></IonIcon>
        ({props.currentFilterCount ?? 0})
      </IonButton>
    </IonButtons>
  </IonToolbar>
}
