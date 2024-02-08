/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");
const { addThread } = require("./ThreadsTableTestHelper");

const CommentsTableHelper = {
  async addComments({
    id = "comment-123",
    content = "a-content",
    threadId = "thread-comment-123",
    ownerId = "owner-thread-123",
    isAddThread = true,
  }) {
    if (isAddThread) await addThread({ id: threadId, ownerId });
    const query = {
      text: "INSERT INTO comments VALUES ($1, $2, $3, $4)",
      values: [id, threadId, content, ownerId],
    };

    await pool.query(query);
  },

  async findCommentById(commentId) {
    const query = {
      text: "SELECT * FROM comments WHERE id = $1",
      values: [commentId],
    };

    const result = await pool.query(query);
    return result.rows[0];
  },

  async cleanTable() {
    await pool.query("DELETE FROM comments WHERE 1=1");
    await pool.query("DELETE FROM threads WHERE 1=1");
  },
};

module.exports = CommentsTableHelper;
