import { IonButton, IonInput } from "@ionic/react";
import { useState } from "react";

export const ProfileForm = () => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <IonInput label="Nome" labelPlacement="floating" disabled={!isEditing} />
      <IonInput
        label="Sobrenome"
        labelPlacement="floating"
        disabled={!isEditing}
      />
      <IonInput label="Email" labelPlacement="floating" disabled={!isEditing} />
      <IonInput
        label="Telefone"
        labelPlacement="floating"
        disabled={!isEditing}
      />
      {isEditing && <IonButton>Salvar</IonButton>}
      {!isEditing && (
        <IonButton onClick={() => setIsEditing(!isEditing)}>Editar</IonButton>
      )}
    </>
  );
};
