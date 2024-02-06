/* istanbul ignore file */

const pool = require("../src/Infrastructures/database/postgres/pool");
const { addUser } = require("./UsersTableTestHelper");

const ThreadsTableHelper = {
  async addThread({
    id = "thread-123",
    title = "a-title",
    body = "a-body",
    ownerId = "user-123",
  }) {
    await addUser({ id: ownerId });
    const query = {
      text: "INSERT INTO threads VALUES($1, $2, $3, $4)",
      values: [id, title, body, ownerId],
    };

    await pool.query(query);
  },

  async findThreadById(threadId) {
    const query = {
      text: "SELECT * FROM threads WHERE id = $1",
      values: [threadId],
    };

    const result = pool.query(query);
    return (await result).rows;
  },

  async cleanTable() {
    await pool.query("DELETE FROM threads WHERE 1=1");
    await pool.query("DELETE FROM users WHERE 1=1");
  },
};

module.exports = ThreadsTableHelper;
