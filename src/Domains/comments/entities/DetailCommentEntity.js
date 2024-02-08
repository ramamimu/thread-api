class DetailCommentEntity {
  constructor(payload) {
    this._verifyPayload(payload);
    const { id, content, date, is_delete: isDelete, username } = payload;
    this.id = id;
    this.content = isDelete ? "**komentar telah dihapus**" : content;
    this.date = date;
    this.username = username;
  }

  _verifyPayload({ id, content, date, is_delete: isDelete, username }) {
    if (!id || !content || !date || isDelete === undefined || !username) {
      throw new Error("DETAIL_COMMENT_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof id !== "string" ||
      typeof content !== "string" ||
      typeof date !== "object" ||
      typeof isDelete !== "boolean" ||
      typeof username !== "string"
    ) {
      throw new Error("DETAIL_COMMENT_ENTITY.NOT_MEET_DATA_TYPE_SPESIFICATION");
    }
  }
}

module.exports = DetailCommentEntity;
