export const CommentState = {
  ACTIVE: "ACTIVE",
  EDITED: "EDITED",
  ARCHIVED: "ARCHIVED",
  DELETED: "DELETED"
};

export class Comment {
  constructor({ id, requestId, authorId, text }) {
    this.id = id;
    this.requestId = requestId;
    this.authorId = authorId;
    this.text = text;
    this.state = CommentState.ACTIVE;
  }

  editComment(newText, user) {
    if (!user || user.id !== this.authorId) {
      throw new Error("Not author");
    }
    if (this.state === CommentState.ARCHIVED) {
      throw new Error("Archived comment");
    }
    if (this.state === CommentState.DELETED) {
      throw new Error("Deleted comment");
    }
    this.text = newText;
    this.state = CommentState.EDITED;
  }

  archiveComment() {
    if (this.state !== CommentState.DELETED) {
      this.state = CommentState.ARCHIVED;
    }
  }

  deleteComment(user) {
    if (!user || user.state !== "ACTIVE") {
      throw new Error("Pouze aktivní uživatel může smazat komentář.");
    }
    if (this.authorId !== user.id) {
      throw new Error("Pouze autor může smazat tento komentář.");
    }
    if (this.state === CommentState.ARCHIVED) {
      throw new Error("Archivovaný komentář již nelze smazat.");
    }
    this.state = CommentState.DELETED;
  }
}