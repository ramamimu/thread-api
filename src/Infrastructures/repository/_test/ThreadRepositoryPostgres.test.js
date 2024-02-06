const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");

const InvariantError = require("../../../Commons/exceptions/InvariantError");
const RegisterThreads = require("../../../Domains/threads/entities/RegisterThreadEntity");
const RegisteredThreads = require("../../../Domains/threads/entities/RegisteredThread");
const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");

describe("ThreadRepositoryPostgres", () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });
  describe("addThread function", () => {
    it("should persist add thread and return added thread correctly", async () => {
      // arrange
      await UsersTableTestHelper.addUser({ id: "user-thread-123" });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        () => "123"
      ); // mock
      const registerThread = new RegisterThreads({
        title: "a-title",
        body: "a-body",
      });

      // action
      await threadRepositoryPostgres.addThread(
        registerThread,
        "user-thread-123"
      );

      // assert
      const threads = await ThreadsTableTestHelper.findThreadById("thread-123");
      expect(threads).toHaveLength(1);
    });
  });
});
