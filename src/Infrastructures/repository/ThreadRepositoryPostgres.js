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

  async addCommentByThreadId(registerComment) {
    // before implement this query, make sure threadId is available in the top layer
    const { content, threadId, owner } = registerComment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: "INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING *",
      values: [id, threadId, content, owner, new Date()],
    };

    const result = await this._pool.query(query);
    return new RegisteredComment({ ...result.rows[0] });
  }

  async verifyAvailableCommentId(commentId) {
    // make sure in the top of layer, add validation to check availability threadId and userId first
    const query = {
      text: "SELECT * FROM comments WHERE id = $1",
      values: [commentId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("komentar tidak ada");
    }
  }

  async verifyCommentOwner({ commentId, ownerId }) {
    const query = {
      text: "SELECT * FROM comments WHERE id = $1 AND owner = $2",
      values: [commentId, ownerId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new AuthorizationError(
        "User tidak memiliki izin untuk menghapus komentar"
      );
    }
  }

  async deleteCommentByCommentId(deleteComment) {
    const { threadId, commentId, ownerId } = deleteComment;
    const query = {
      text: "UPDATE comments SET is_delete = TRUE WHERE thread_id = $1 AND id = $2 AND owner = $3",
      values: [threadId, commentId, ownerId],
    };

    await this._pool.query(query);
  }

  async getDetailThreadById(threadId) {
    const query = {
      text: "SELECT a.id,  a.title, a.body, a.date, b.username FROM threads as a JOIN users as b ON a.owner = b.id GROUP BY a.id, b.username HAVING a.id = $1",
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return new DetailThreadEntity({ ...result.rows[0], comments: [] });
  }

  async getDetailCommentByThreadId(threadId) {
    const query = {
      text: "SELECT a.id, a.content, a.date, a.is_delete, b.username FROM comments AS a JOIN users as b ON a.owner = b.id GROUP BY a.id, b.username HAVING a.thread_id = $1 ORDER BY a.date",
      values: [threadId],
    };

    const result = await this._pool.query(query);
    const comments = result.rows.map((item) => new DetailCommentEntity(item));
    return comments;
  }
}

module.exports = ThreadRepositoryPostgress;
