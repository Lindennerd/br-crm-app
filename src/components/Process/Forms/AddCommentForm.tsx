import { IonTextarea, IonButton } from "@ionic/react";
import { useState } from "react";
import { ProcessComment } from "../../../types/app.types";

export interface AddCommentFormProps {
  comment: ProcessComment;
  onCommentChange: (comment: ProcessComment) => void;
  cancelComment: () => void;
}

export const AddCommentForm = (props: AddCommentFormProps) => {
  const [edittingComment, setEdittingComment] = useState<ProcessComment>(
    props.comment
  );

  return (
    <>
      <IonTextarea
        style={{ padding: "0.5em" }}
        fill="solid"
        label="Comentário"
        labelPlacement="floating"
        placeholder="Descreva o comentário"
        value={edittingComment.comment}
        onIonChange={(e) =>
          setEdittingComment({
            ...edittingComment,
            comment: e.detail.value ?? "",
          })
        }
      />
      <div style={{ display: "flex", flexDirection: "row-reverse" }}>
        <IonButton
          color="primary"
          onClick={(e) => {
            props.onCommentChange(edittingComment);
            setEdittingComment({
              ...edittingComment,
              comment: "",
            });
          }}
        >
          Adicionar Comentário
        </IonButton>
        <IonButton color="danger" onClick={(e) => props.cancelComment()}>
          cancelar
        </IonButton>
      </div>
    </>
  );
};
