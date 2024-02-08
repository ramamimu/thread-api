const ThreadRepository = require("../../Domains/threads/ThreadRepository");

const RegisteredThread = require("../../Domains/threads/entities/RegisteredThread");
const RegisteredComment = require("../../Domains/threads/entities/RegisteredCommentEntity");
const DetailThreadEntity = require("../../Domains/threads/entities/DetailThreadEntity");
const DetailCommentEntity = require("../../Domains/threads/entities/DetailCommentEntity");

const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");

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

    // before insert to thread table, make sure on the top of layer has checked owner existance
    const result = await this._pool.query(query);
    return new RegisteredThread({ ...result.rows[0] });
  }

  async verifyAvailableThreadId(threadId) {
    const query = {
      text: "SELECT * FROM threads WHERE id = $1",
      values: [threadId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("Thread tidak ada");
    }
  }

  async getDetailThreadById(threadId) {
    const query = {
      text: "SELECT a.id,  a.title, a.body, a.date, b.username FROM threads as a JOIN users as b ON a.owner = b.id GROUP BY a.id, b.username HAVING a.id = $1",
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return new DetailThreadEntity({ ...result.rows[0], comments: [] });
  }
}

module.exports = ThreadRepositoryPostgress;
