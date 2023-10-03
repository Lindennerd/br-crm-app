import { IonButton, IonInput } from "@ionic/react";
import { useEffect, useState } from "react";
import { useUpdateProfile } from "../../api/useUserApi";
import { useAuthContext } from "../../context/AuthContext";
import { Profile } from "../../types";

export const ProfileForm = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuthContext();
  const [profile, setProfile] = useState<Partial<Profile>>();
  const updateProfileMutation = useUpdateProfile();

  useEffect(() => {
    setProfile(user?.Profile);
  }, [user]);

  function handleSave() {
    if (profile) {
      updateProfileMutation.mutate(
        {
          email: profile.email ?? "",
          firstName: profile.firstName ?? "",
          lastName: profile.lastName ?? "",
          phoneNumber: profile.phoneNumber ?? "",
          picture: profile.picture ?? "",
          id: profile.id ?? "",
        },
        {
          onSuccess: () => setIsEditing(false),
          onError: (err) => console.error(err),
        }
      );
    }
  }

  return (
    <>
      <IonInput
        label="Nome"
        labelPlacement="floating"
        disabled={!isEditing}
        value={profile?.firstName}
        onIonInput={(e) =>
          setProfile({ ...profile, firstName: e.detail.value! })
        }
      />
      <IonInput
        label="Sobrenome"
        labelPlacement="floating"
        disabled={!isEditing}
        value={profile?.lastName}
        onIonInput={(e) =>
          setProfile({ ...profile, lastName: e.detail.value! })
        }
      />
      <IonInput
        type="email"
        label="Email"
        labelPlacement="floating"
        disabled={!isEditing}
        value={profile?.email}
        onIonInput={(e) => setProfile({ ...profile, email: e.detail.value! })}
      />
      <IonInput
        label="Telefone"
        labelPlacement="floating"
        disabled={!isEditing}
        value={profile?.phoneNumber}
        onIonInput={(e) =>
          setProfile({ ...profile, phoneNumber: e.detail.value! })
        }
      />
      {isEditing && (
        <>
          <IonButton onClick={(e) => handleSave()}>Salvar</IonButton>
          <IonButton onClick={() => setIsEditing(!isEditing)}>
            Cancelar
          </IonButton>
        </>
      )}
      {!isEditing && (
        <IonButton onClick={() => setIsEditing(!isEditing)}>Editar</IonButton>
      )}
    </>
  );
};
