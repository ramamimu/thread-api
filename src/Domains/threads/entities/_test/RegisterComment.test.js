const RegisterComment = require("../RegisterCommentEntity");

describe("RegisterComment entity", () => {
  it("should throw error when not contain needed property", () => {
    // arrange
    const payload = {
      content: "hello",
      owner: "braba",
    };
    // action & assert
    expect(() => new RegisterComment(payload)).toThrowError(
      "REGISTER_COMMENT_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });
  it("should throw error when not meet data type spesification", () => {
    // arrange
    const payload = {
      content: "hello",
      owner: "braba",
      threadId: 14312,
    };
    // action & assert
    expect(() => new RegisterComment(payload)).toThrowError(
      "REGISTER_COMMENT_ENTITY.NOT_MEET_DATA_TYPE_SPESIFICATION"
    );
  });
  it("should create object RegisterComment properly", () => {
    // arrange
    const payload = {
      content: "hello",
      owner: "braba",
      threadId: "a-thread-id",
    };
    // action
    const registerComment = new RegisterComment(payload);
    //   assert

    expect(registerComment.content).toStrictEqual(payload.content);
    expect(registerComment.owner).toStrictEqual(payload.owner);
    expect(registerComment.threadId).toStrictEqual(payload.threadId);
  });
});
