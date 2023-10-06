import { IonButton } from "@ionic/react";
import { useState } from "react";
import { ProcessComment } from "../../../types/app.types";
import { CommentTextField } from "./CommentTextField";

export interface AddCommentFormProps {
  comment: ProcessComment;
  onCommentChange: (comment: ProcessComment) => void;
  cancelComment: () => void;
}

export const AddCommentForm = (props: AddCommentFormProps) => {
  const [edittingComment, setEdittingComment] = useState<ProcessComment>(
    props.comment
  );

  function handleChangeComment(comment: ProcessComment): void {
    setEdittingComment({
      ...edittingComment,
      comment: comment.comment,
      taggedUsers: comment.taggedUsers,
    });
  }

  return (
    <>
      <CommentTextField
        cancelComment={props.cancelComment}
        comment={props.comment}
        onCommentChange={handleChangeComment}
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
