const ThreadRepository = require("../../Domains/threads/ThreadRepository");
const RegisteredThread = require("../../Domains/threads/entities/RegisteredThread");

class ThreadRepositoryPostgress extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(registerThread, ownerId) {
    const { title, body } = registerThread;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: "INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING *",
      values: [id, title, body, ownerId],
    };

    // before insert to thread table, make sure in the top of layer has checked owner availability
    const result = await this._pool.query(query);
    return new RegisteredThread({ ...result.rows[0] });
  }
}

module.exports = ThreadRepositoryPostgress;
