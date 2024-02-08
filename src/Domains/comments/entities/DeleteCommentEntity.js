class DeleteCommentEntity {
  constructor(payload) {
    this._verifyPayload(payload);
    const { threadId, commentId, ownerId } = payload;
    this.threadId = threadId;
    this.commentId = commentId;
    this.ownerId = ownerId;
  }

  _verifyPayload({ threadId, commentId, ownerId }) {
    if (!threadId || !commentId || !ownerId) {
      throw new Error("DELETE_COMMENT_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof threadId !== "string" ||
      typeof commentId !== "string" ||
      typeof ownerId !== "string"
    ) {
      throw new Error("DELETE_COMMENT_ENTITY.NOT_MEET_DATA_TYPE_SPESIFICATION");
    }
  }
}

module.exports = DeleteCommentEntity;
