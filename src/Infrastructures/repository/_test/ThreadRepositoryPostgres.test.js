const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentsTableHelper = require("../../../../tests/CommentsTableHelper");

const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");

const RegisterThreads = require("../../../Domains/threads/entities/RegisterThreadEntity");

const NotFoundError = require("../../../Commons/exceptions/NotFoundError");

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
      const ownerPayload = { id: "user-thread-123" };
      const threadPayload = {
        title: "a-title",
        body: "a-body",
      };
      await UsersTableTestHelper.addUser(ownerPayload);
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        () => "123"
      ); // mock
      const registerThread = new RegisterThreads(threadPayload);

      // action
      await threadRepositoryPostgres.addThread(registerThread, ownerPayload.id);

      // assert
      const threads = await ThreadsTableTestHelper.findThreadById("thread-123");
      expect(threads).toHaveLength(1);
      expect(threads[0].title).toEqual(threadPayload.title);
      expect(threads[0].body).toEqual(threadPayload.body);
      expect(threads[0].owner).toEqual(ownerPayload.id);
    });
  });

  describe("verifyAvailableThreadId function", () => {
    it("should return error when thread id not found", async () => {
      const threadRepository = new ThreadRepositoryPostgres(pool, () => {});
      await expect(
        threadRepository.verifyAvailableThreadId("thread-123")
      ).rejects.toThrow(NotFoundError);
    });
    it("should not throw error when thread id found", async () => {
      await ThreadsTableTestHelper.addThread({ id: "thread-available-123" });
      const threadRepository = new ThreadRepositoryPostgres(pool, () => {});
      await expect(
        threadRepository.verifyAvailableThreadId("thread-available-123")
      ).resolves.not.toThrow(NotFoundError);
    });
  });

  describe("getDetailThreadById", () => {
    it("should return the object of Detail Tread Entity", async () => {
      const payload = {
        id: "thread-available-123",
        title: "a-title",
        body: "a-body",
        ownerId: "an-owner",
      };
      await ThreadsTableTestHelper.addThread(payload);

      const threadRepository = new ThreadRepositoryPostgres(pool, {});
      const detailThread = await threadRepository.getDetailThreadById(
        payload.id
      );

      expect(detailThread.id).toStrictEqual(payload.id);
      expect(detailThread.title).toStrictEqual(payload.title);
      expect(detailThread.body).toStrictEqual(payload.body);
      expect(detailThread.username).toStrictEqual("username-default");
    });
  });
});
