export const CommentState = {
  ACTIVE: "ACTIVE",
  EDITED: "EDITED",
  ARCHIVED: "ARCHIVED"
};

export class Comment {
  constructor({ id, requestId, authorId, text }) {
    this.id = id;
    this.requestId = requestId;
    this.authorId = authorId;
    this.text = text;
    this.state = CommentState.ACTIVE;
  }

  addComment(request, user, text) {
    if (!user || user.state !== "ACTIVE") {
      throw new Error("Only active user");
    }

    this.requestId = request.id;
    this.authorId = user.id;
    this.text = text;
    this.state = CommentState.ACTIVE;
  }

  editComment(newText, user) {
    if (user.id !== this.authorId) {
      throw new Error("Not author");
    }
    if (this.state === CommentState.ARCHIVED) {
      throw new Error("Archived comment");
    }

    this.text = newText;
    this.state = CommentState.EDITED;
  }

  archiveComment() {
    this.state = CommentState.ARCHIVED;
  }
}