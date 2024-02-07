const ThreadRepository = require("../../Domains/threads/ThreadRepository");
const RegisteredThread = require("../../Domains/threads/entities/RegisteredThread");
const RegisteredComment = require("../../Domains/threads/entities/RegisteredCommentEntity");

const NotFoundError = require("../../Commons/exceptions/NotFoundError");

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

  async addCommentByThreadId(registerComment) {
    // before implement this query, make sure threadId is available in the top layer
    const { content, threadId, owner } = registerComment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: "INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING *",
      values: [id, threadId, content, owner],
    };

    const result = await this._pool.query(query);
    return new RegisteredComment({ ...result.rows[0] });
  }

  async verifyAvailableCommentId(deleteComment) {
    // make sure in the top of layer, add validation to check availability threadId and userId first
    const { threadId, commentId, ownerId } = deleteComment;
    const query = {
      text: "SELECT * FROM comments WHERE id = $1 AND thread_id = $2 AND owner = $3",
      values: [commentId, threadId, ownerId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw NotFoundError("komentar tidak ada");
    }
  }

  async deleteCommentByCommentId(deleteComment) {
    const { threadId, commentId, ownerId } = deleteComment;
    const query = {
      text: "UPDATE comments SET is_delete = TRUE, content ='**komentar telah dihapus**' WHERE thread_id = $1 AND id = $2 AND owner = $3",
      values: [threadId, commentId, ownerId],
    };

    await this._pool.query(query);
  }
}

module.exports = ThreadRepositoryPostgress;
