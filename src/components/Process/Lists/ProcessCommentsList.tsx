import {
  IonList,
  IonListHeader,
  IonIcon,
  IonTitle,
  IonButton,
  IonItem,
  IonLabel,
  IonNote,
  IonPopover,
  IonButtons,
} from "@ionic/react";
import {
  chatbox,
  addSharp,
  chatbubble,
  close,
  ellipsisVertical,
  pencil,
} from "ionicons/icons";
import { ProcessComment } from "../../../types/app.types";
import { useState } from "react";
import { AddCommentForm } from "../Forms/AddCommentForm";
import { useAuthContext } from "../../../context/AuthContext";

export interface ProcessCommentsListProps {
  comments: ProcessComment[];
  onCommentChange: (comment: ProcessComment) => void;
  onDeletedComment: (comment: ProcessComment) => void;
}

export const ProcessCommentsList = (props: ProcessCommentsListProps) => {
  const { user } = useAuthContext();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editComment, setEditComment] = useState<ProcessComment | null>(null);
  const defaultComment: ProcessComment = {
    id: null,
    authorId: "",
    authorName: "",
    comment: "",
    createdAt: new Date(),
  };

  function handleCommentChange(comment: ProcessComment): void {
    props.onCommentChange(comment);
    setShowAddForm(false);
  }

  function handleEditComment(comment: ProcessComment): void {
    setEditComment(comment);
    setShowAddForm(true);
  }

  function handleDeleteComment(comment: ProcessComment): void {
    props.onDeletedComment(comment);
  }

  return (
    <IonList lines="full">
      <IonListHeader color="tertiary">
        <IonIcon icon={chatbox} />
        <IonTitle>Comentários</IonTitle>
        <IonButton
          fill="clear"
          color="light"
          style={{ marginRight: "1em" }}
          onClick={(e) => setShowAddForm(!showAddForm)}
        >
          <IonIcon icon={showAddForm ? close : addSharp} />
        </IonButton>
      </IonListHeader>
      {showAddForm && (
        <IonItem color="light">
          <IonIcon slot="start" icon={chatbubble} />
          <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            <AddCommentForm
              comment={editComment ?? defaultComment}
              onCommentChange={handleCommentChange}
              cancelComment={() => {
                setShowAddForm(false)
                setEditComment(null)
              }}
            />
          </div>
        </IonItem>
      )}
      {props.comments.length <= 0 && (
        <IonItem>
          <IonIcon slot="start" icon={chatbubble} />
          <IonLabel>Nenhum comentário nesse processo</IonLabel>
        </IonItem>
      )}
      {props.comments.map((comment, index) => (
        <IonItem key={index}>
          <IonIcon slot="start" icon={chatbubble} />
          <IonLabel>{comment.comment}</IonLabel>
          <IonNote>
            <p>{comment.authorName}</p>
            <p>{new Date(comment.createdAt).toLocaleDateString()} </p>
          </IonNote>
          {user?.user.id === comment.authorId && (
            <IonButton
              fill="clear"
              color="medium"
              slot="end"
              id={`comment-options-${index}`}
            >
              <IonIcon icon={ellipsisVertical} />
            </IonButton>
          )}

          <IonPopover trigger={`comment-options-${index}`} side="top">
            <IonButtons
              style={{
                display: "flex",
                flexDirection: "column",
                padding: ".5rem",
              }}
            >
              <IonButton
                style={{ width: "100%" }}
                fill="clear"
                color="primary"
                onClick={(e) => handleEditComment(comment)}
              >
                Editar <IonIcon icon={pencil} />
              </IonButton>
              <IonButton
                style={{ width: "100%" }}
                fill="clear"
                color="danger"
                onClick={(e) => handleDeleteComment(comment)}
              >
                Remover <IonIcon icon={close} />
              </IonButton>
            </IonButtons>
          </IonPopover>
        </IonItem>
      ))}
    </IonList>
  );
};
