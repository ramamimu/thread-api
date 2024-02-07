const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentsTableHelper = require("../../../../tests/CommentsTableHelper");

const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");

const RegisterThreads = require("../../../Domains/threads/entities/RegisterThreadEntity");
const RegisterComment = require("../../../Domains/threads/entities/RegisterCommentEntity");
const DeleteCommentEntity = require("../../../Domains/threads/entities/DeleteCommentEntity");

const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");

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

  describe("addCommentByThreadId", () => {
    it("should persist add comment by thread Id", async () => {
      // arrange
      const payload = {
        threadId: "test-available-123",
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
      const registeredComment = await threadRepository.addCommentByThreadId(
        registerComment
      );
      expect(registeredComment.content).toEqual(payload.content);
      expect(registeredComment.id).toEqual(payload.commentId);
      expect(registeredComment.isDelete).toEqual(false);
    });
  });

  describe("verifyAvailableCommentId", () => {
    it("should throw NotFoundError when comment not available", async () => {
      const payload = {
        threadId: "available-thread-id",
        commentId: "available-comment-id",
        ownerId: "available-owner-id",
      };

      const threadRepository = new ThreadRepositoryPostgres(pool, {});
      await expect(() =>
        threadRepository.verifyAvailableCommentId(payload.commentId)
      ).rejects.toThrow(NotFoundError);
    });
    it("should not throw NotFoundError when all variable verified", async () => {
      const payload = {
        threadId: "available-thread-id",
        commentId: "available-comment-id",
        ownerId: "available-owner-id",
      };

      await CommentsTableHelper.addComments({
        id: payload.commentId,
        threadId: payload.threadId,
        ownerId: payload.ownerId,
      });

      const threadRepository = new ThreadRepositoryPostgres(pool, {});
      await expect(
        threadRepository.verifyAvailableCommentId(payload.commentId)
      ).resolves.not.toThrow(NotFoundError);
    });
  });

  describe("deleteCommentByCommentId", () => {
    it("should not throw error when delete comment", async () => {
      // arrange
      const payload = {
        threadId: "test-available-123",
        ownerId: "user-comment-123",
        commentId: "comment-123",
        content: "content-123",
      };

      await CommentsTableHelper.addComments({
        id: payload.commentId,
        ...payload,
      });

      const deleteCommentEntity = new DeleteCommentEntity(payload);
      const threadRepository = new ThreadRepositoryPostgres(pool, () => "123");
      expect(() =>
        threadRepository.deleteCommentByCommentId(deleteCommentEntity)
      ).not.toThrow();
    });
  });

  describe("verifyCommentOwner", () => {
    it("should throw authorization error", async () => {
      const payload = {
        threadId: "test-available-123",
        ownerId: "user-comment-123",
        commentId: "comment-123",
        content: "content-123",
      };

      await CommentsTableHelper.addComments({
        id: payload.commentId,
        ...payload,
      });

      const threadRepository = new ThreadRepositoryPostgres(pool, {});
      expect(
        threadRepository.verifyCommentOwner({
          commentId: payload.commentId,
          ownerId: "sembarang-owner",
        })
      ).rejects.toThrow(AuthorizationError);
    });
    it("should not throw authorization error", async () => {
      const payload = {
        threadId: "test-available-123",
        ownerId: "user-comment-123",
        commentId: "comment-123",
        content: "content-123",
      };

      await CommentsTableHelper.addComments({
        id: payload.commentId,
        ...payload,
      });

      const threadRepository = new ThreadRepositoryPostgres(pool, {});
      expect(threadRepository.verifyCommentOwner(payload)).resolves.not.toThrow(
        AuthorizationError
      );
    });
  });
});
