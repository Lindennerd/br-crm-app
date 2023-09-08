import { IonCol, IonGrid, IonRow } from "@ionic/react";

export const DataTable = ({
  headers,
  data,
  onRowClick,
}: {
  headers: string[];
  data: any[];
  onRowClick: (data: any) => void;
}) => {
  return (
    <IonGrid>
      <IonRow>
        {headers.map((header) => (
          <IonCol key={header}>{header}</IonCol>
        ))}
      </IonRow>
      {data.map((row) => (
        <IonRow key={row.id} onClick={() => onRowClick(row)}>
          {Object.values(row).map((value) => (
            <IonCol key={value as string}>{value as string}</IonCol>
          ))}
        </IonRow>
      ))}
    </IonGrid>
  );
};
