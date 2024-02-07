const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentsTableHelper = require("../../../../tests/CommentsTableHelper");

const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");

const RegisterThreads = require("../../../Domains/threads/entities/RegisterThreadEntity");
const RegisterComment = require("../../../Domains/threads/entities/RegisterCommentEntity");

const InvariantError = require("../../../Commons/exceptions/InvariantError");

describe("ThreadRepositoryPostgres", () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableHelper.cleanTable();
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
    it("should return error when thread id not found", async () => {
      const threadRepository = new ThreadRepositoryPostgres(pool, () => {});
      await expect(
        threadRepository.verifyAvailableThreadId("thread-123")
      ).rejects.toThrow(InvariantError);
    });
    it("should not throw error when thread id found", async () => {
      await ThreadsTableTestHelper.addThread({ id: "thread-available-123" });
      const threadRepository = new ThreadRepositoryPostgres(pool, () => {});
      await expect(
        threadRepository.verifyAvailableThreadId("thread-available-123")
      ).resolves.not.toThrow(InvariantError);
    });
    it("should persist add comment by thread Id", async () => {
      // arrange
      const payload = {
        threadId: "thread-comment-123",
        ownerId: "user-comment-123",
        commentId: "comment-123",
        content: "content-123",
      };
      await ThreadsTableTestHelper.addThread({
        id: payload.threadId,
        ownerId: payload.ownerId,
      });

      const threadRepository = new ThreadRepositoryPostgres(pool, () => "123");
      const registerComment = new RegisterComment({
        content: payload.content,
        threadId: payload.threadId,
        owner: payload.ownerId,
      });

      // action
      await threadRepository.addCommentByThreadId(registerComment);
    });
  });
});
