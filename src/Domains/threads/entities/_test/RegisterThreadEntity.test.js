const RegisterThreadEntity = require("../RegisterThreadEntity");

describe("a RegisterThreadEntity", () => {
  it("should throw error when payload did not contain needed property", () => {
    const payload = {
      title: "hello",
    };

    expect(() => new RegisterThreadEntity(payload)).toThrowError(
      "REGISTER_THREAD_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });
  it("should throw error when payload did not meet data type specification", () => {
    const payload = {
      title: "hello",
      body: 11,
    };
    expect(() => new RegisterThreadEntity(payload)).toThrowError(
      "REGISTER_THREAD_ENTITY.NOT_MEET_DATA_TYPE_SPESIFICATION"
    );
  });
  it("should create registerThreadEntities correctly", () => {
    // arrange
    const payload = {
      title: "hello",
      body: "world",
    };

    // action
    const { title, body } = new RegisterThreadEntity(payload);

    // assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
  });
});
