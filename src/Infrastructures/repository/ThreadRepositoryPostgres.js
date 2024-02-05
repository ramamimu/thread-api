const InvariantError = require("../../Commons/exceptions/InvariantError");
const ThreadRepository = require("../../Domains/threads/ThreadRepository");
// const RegisteredUser = require('../../Domains/users/entities/RegisteredUser');
// const UserRepository = require('../../Domains/users/UserRepository');

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
      text: "INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id",
      values: [id, title, body, ownerId],
    };

    const result = this._pool.query(query);
    if (!result.rows.length) {
      throw new Error("Thread gagal ditambahkan");
    }

    // return registeredThread ya
  }
}

module.exports = ThreadRepositoryPostgress;
