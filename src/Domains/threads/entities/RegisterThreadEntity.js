class RegisterThreadEntity {
  constructor({ title, body }) {
    this._verifyPayload(title, body);
    this.title = title;
    this.body = body;
  }

  _verifyPayload(title, body) {
    if (!title || !body) {
      throw new Error("REGISTER_THREAD_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (typeof title !== "string" || typeof body !== "string") {
      throw new Error(
        "REGISTER_THREAD_ENTITY.NOT_MEET_DATA_TYPE_SPESIFICATION"
      );
    }
  }
}

module.exports = RegisterThreadEntity;
