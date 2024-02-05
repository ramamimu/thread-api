const RegisteredThread = require("../RegisteredThread");

describe("RegisteredThread entity", () => {
  it("should throw error when payload did not contain needed property", () => {
    const payload = {
      id: "an-id",
      title: "a-title",
    };

    expect(() => new RegisteredThread(payload)).toThrowError(
      "REGISTERED_THREAD_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });
  it("should throw error when payload did not meet data type spesification", () => {
    const payload = {
      id: "an-id",
      title: 25,
      body: "body",
      owner: "owner",
      date: "date",
    };

    expect(() => new RegisteredThread(payload)).toThrowError(
      "REGISTERED_THREAD_ENTITY.NOT_MEET_DATA_TYPE_SPESIFICATION"
    );
  });
  it("should create object RegisteredThread properly", () => {
    const payload = {
      id: "an-id",
      title: "a-title",
      body: "body",
      owner: "owner",
      date: "date",
    };

    const { id, title, body, owner, date } = new RegisteredThread(payload);

    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(owner).toEqual(payload.owner);
    expect(date).toEqual(payload.date);
  });
});
