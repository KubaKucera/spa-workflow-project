export const CommentState = {
  ACTIVE: "ACTIVE",
  EDITED: "EDITED",
  ARCHIVED: "ARCHIVED",
};

export class Comment {
  constructor({ id, requestId, authorId, text }) {
    this.id = id;
    this.requestId = requestId;
    this.authorId = authorId;
    this.text = text;
    this.state = CommentState.ACTIVE;
  }

  // Přechod ACTIVE -> EDITED (akce EDIT_COMMENT, pouze autor)
  edit(newText, currentUser) {
    if (!currentUser || currentUser.id !== this.authorId) {
      throw new Error("Komentář může upravit pouze jeho autor.");
    }

    if (
      this.state !== CommentState.ACTIVE &&
      this.state !== CommentState.EDITED
    ) {
      throw new Error(
        "Komentář může upravit pouze ve stavu ACTIVE nebo EDITED.",
      );
    }

    this.text = newText;
    this.state = CommentState.EDITED;
  }

  // Přechod ACTIVE/EDITED -> ARCHIVED (po dokončení Request)
  archive() {
    if (this.state === CommentState.ARCHIVED) {
      throw new Error("Komentář je už archivován.");
    }

    this.state = CommentState.ARCHIVED;
  }
}
