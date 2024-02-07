class RegisteredCommentEntity {
  constructor({
    id,
    thread_id: threadId,
    content,
    owner,
    date,
    is_delete: isDelete,
  }) {
    this._verifyPayload(id, content, owner, date, isDelete, threadId);
    this.id = id;
    this.content = content;
    this.owner = owner;
    this.date = date;
    this.isDelete = isDelete;
    this.threadId = threadId;
  }

  _verifyPayload(id, content, owner, date, isDelete, threadId) {
    if (
      !id ||
      !content ||
      !owner ||
      !date ||
      isDelete === undefined ||
      !threadId
    ) {
      throw new Error("REGISTERED_COMMENT_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof id !== "string" ||
      typeof content !== "string" ||
      typeof owner !== "string" ||
      typeof date !== "object" ||
      typeof isDelete !== "boolean" ||
      typeof threadId !== "string"
    ) {
      throw new Error(
        "REGISTERED_COMMENT_ENTITY.NOT_MEET_DATA_TYPE_SPESIFICATION"
      );
    }
  }
}

module.exports = RegisteredCommentEntity;
