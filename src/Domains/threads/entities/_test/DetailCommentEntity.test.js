const DetailCommentEntity = require("../DetailCommentEntity");

describe("DetailComment Entity", () => {
  it("should return error when not contain appropriate property", () => {
    const payload = {
      id: "comment-123",
      content: "content-comment",
      date: {},
      is_delete: true,
    };

    expect(() => new DetailCommentEntity(payload)).toThrowError(
      "DETAIL_COMMENT_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });
  it("should return error when not meet data type spesification", () => {
    const payload = {
      id: "comment-123",
      content: "content-comment",
      date: {},
      is_delete: true,
      username: 12345,
    };

    expect(() => new DetailCommentEntity(payload)).toThrowError(
      "DETAIL_COMMENT_ENTITY.NOT_MEET_DATA_TYPE_SPESIFICATION"
    );
  });
  it("should not return error and create DetailComment Entity properly with delete content", () => {
    const payload = {
      id: "comment-123",
      content: "content-comment",
      date: {},
      is_delete: true,
      username: "user-comment",
    };

    const detailCommentEntity = new DetailCommentEntity(payload);
    expect(detailCommentEntity.username).toStrictEqual(payload.username);
    expect(detailCommentEntity.id).toStrictEqual(payload.id);
    expect(detailCommentEntity.content).toStrictEqual(
      "**komentar telah dihapus**"
    );
    expect(detailCommentEntity.date).toStrictEqual(payload.date);
  });
  it("should not return error and create DetailComment Entity properly with no delete content", () => {
    const payload = {
      id: "comment-123",
      content: "content-comment",
      date: {},
      is_delete: false,
      username: "user-comment",
    };

    const detailCommentEntity = new DetailCommentEntity(payload);
    expect(detailCommentEntity.username).toStrictEqual(payload.username);
    expect(detailCommentEntity.id).toStrictEqual(payload.id);
    expect(detailCommentEntity.content).toStrictEqual(payload.content);
    expect(detailCommentEntity.date).toStrictEqual(payload.date);
  });
});
