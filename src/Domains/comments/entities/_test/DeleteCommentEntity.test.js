const DeleteCommentEntity = require("../DeleteCommentEntity");

describe("DeteleCommentEntity", () => {
  it("should throw error when not contain needed property", () => {
    const payload = {
      threadId: "a-thread",
      commentId: "a-comment",
    };

    expect(() => new DeleteCommentEntity(payload)).toThrowError(
      "DELETE_COMMENT_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });
  it("should throw error when not meet data type spesification", () => {
    const payload = {
      threadId: "a-thread",
      commentId: "a-comment",
      ownerId: 123,
    };

    expect(() => new DeleteCommentEntity(payload)).toThrowError(
      "DELETE_COMMENT_ENTITY.NOT_MEET_DATA_TYPE_SPESIFICATION"
    );
  });
  it("should create object DeleteCommentEntity properly", () => {
    const payload = {
      threadId: "a-thread",
      commentId: "a-comment",
      ownerId: "owner-id",
    };

    const deleteCommentEntity = new DeleteCommentEntity(payload);
    expect(deleteCommentEntity).toEqual(payload);
  });
});
