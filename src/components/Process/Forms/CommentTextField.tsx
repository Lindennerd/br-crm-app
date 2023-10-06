import { IonSelect, IonSelectOption, IonTextarea } from "@ionic/react";
import { useState } from "react";
import { useGetUsers } from "../../../api/useUserApi";
import { useAuthContext } from "../../../context/AuthContext";
import { User } from "../../../types";
import { GetUsers, ProcessComment } from "../../../types/app.types";

export interface CommentTextFieldProps {
  comment: ProcessComment;
  onCommentChange: (comment: ProcessComment) => void;
  cancelComment: () => void;
}

export const CommentTextField = (props: CommentTextFieldProps) => {
  const { user } = useAuthContext();
  const [getUsersParam, setGetUsersParam] = useState<GetUsers>({
    organization: user?.organization?.id ?? "",
    page: 1,
    pageSize: 1000,
  });
  const [commentContent, setCommentContent] = useState<string>(
    props.comment.comment ?? ""
  );
  const [atTyped, setAtTyped] = useState<boolean>(false);

  const { data: users } = useGetUsers(getUsersParam);

  function handleChangeComment(): void {
    const taggedUsers: string[] =
      users
        ?.filter((user) => commentContent.includes(user.name))
        .map((user) => {
          return user.id;
        }) ?? [];

    props.onCommentChange({
      ...props.comment,
      comment: commentContent,
      taggedUsers: taggedUsers,
    });
  }

  function handleInput(input: string | null | undefined): void {
    if (!input) return;
    setAtTyped(input[input.length - 1] === "@");
    setCommentContent(input);
  }

  function handleSelectUser(user: User): void {
    setAtTyped(false);
    setCommentContent(commentContent + user.name + " ");
  }

  return (
    <>
      <IonTextarea
        style={{ padding: "0.5em" }}
        label="Comentário"
        labelPlacement="floating"
        placeholder="Descreva o comentário"
        value={commentContent}
        onIonInput={(e) => {
          handleInput(e.detail.value);
        }}
        onIonBlur={(e) => handleChangeComment()}
      />

      <IonSelect
        placeholder="Selecione o usuário a ser mencionado"
        onIonChange={(e) => handleSelectUser(e.detail.value)}
        interface="popover"
        style={{ display: atTyped ? "block" : "none" }}
      >
        {users &&
          users?.map((user) => (
            <IonSelectOption key={user.id} value={user}>
              {user.name}
            </IonSelectOption>
          ))}
      </IonSelect>
    </>
  );
};
