class RegisterCommentEntity {
  constructor(payload) {
    this._verifyPayload(payload);

    const { content, threadId, owner } = payload;
    this.content = content;
    this.threadId = threadId;
    this.owner = owner;
  }

  _verifyPayload({ content, threadId, owner }) {
    if (!content || !threadId || !owner) {
      throw new Error("REGISTER_COMMENT_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof content !== "string" ||
      typeof threadId !== "string" ||
      typeof owner !== "string"
    ) {
      throw new Error(
        "REGISTER_COMMENT_ENTITY.NOT_MEET_DATA_TYPE_SPESIFICATION"
      );
    }
  }
}

module.exports = RegisterCommentEntity;
