class RegisteredThread {
  constructor(payload) {
    this._verifyPayload(payload);
    const { id, title, body, owner, date } = payload;
    this.id = id;
    this.title = title;
    this.body = body;
    this.owner = owner;
    this.date = date;
  }

  _verifyPayload({ id, title, body, owner, date }) {
    if (!id || !title || !body || !owner || !date) {
      throw new Error("REGISTERED_THREAD_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof id !== "string" ||
      typeof title !== "string" ||
      typeof body !== "string" ||
      typeof owner !== "string" ||
      typeof date !== "string"
    ) {
      throw new Error(
        "REGISTERED_THREAD_ENTITY.NOT_MEET_DATA_TYPE_SPESIFICATION"
      );
    }
  }
}

module.exports = RegisteredThread;
