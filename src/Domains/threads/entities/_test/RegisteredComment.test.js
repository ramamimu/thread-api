const RegisteredComment = require("../RegisteredCommentEntity");

describe("RegisteredComment Entity", () => {
  it("should throw error when not contain needed propery", () => {
    // arrange
    const payload = {
      id: "an-id",
      thread_id: "a-thread-id",
      content: "a-content",
      owner: "an-owner",
    };

    // action & assert
    expect(() => new RegisteredComment(payload)).toThrowError(
      "REGISTERED_COMMENT_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });
  it("should throw error when not meet data type spesification", () => {
    // arrange
    const payload = {
      id: "an-id",
      thread_id: "a-thred-id",
      content: "a-content",
      owner: "an-owner",
      date: {},
      is_delete: 11,
    };

    // action & assert
    expect(() => new RegisteredComment(payload)).toThrowError(
      "REGISTERED_COMMENT_ENTITY.NOT_MEET_DATA_TYPE_SPESIFICATION"
    );
  });
  it("should create object RegisteredComment properly", () => {
    // arrange
    const payload = {
      id: "an-id",
      thread_id: "a-thred-id",
      content: "a-content",
      owner: "an-owner",
      date: {},
      is_delete: true,
    };

    // action
    const registerComment = new RegisteredComment(payload);

    //   assert
    expect(registerComment.id).toStrictEqual(payload.id);
    expect(registerComment.content).toStrictEqual(payload.content);
    expect(registerComment.owner).toStrictEqual(payload.owner);
    expect(registerComment.date).toStrictEqual(payload.date);
    expect(registerComment.threadId).toStrictEqual(payload.thread_id);
    expect(registerComment.isDelete).toStrictEqual(payload.is_delete);
  });
});
