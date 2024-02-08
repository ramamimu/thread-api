const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentsTableHelper = require("../../../../tests/CommentsTableHelper");

const pool = require("../../database/postgres/pool");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");

const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");

const RegisterComment = require("../../../Domains/comments/entities/RegisterCommentEntity");
const DeleteCommentEntity = require("../../../Domains/comments/entities/DeleteCommentEntity");

describe("CommentRepositoryPostgres", () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
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

      const threadRepository = new CommentRepositoryPostgres(pool, () => "123");
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

      const threadRepository = new CommentRepositoryPostgres(pool, {});
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

      const threadRepository = new CommentRepositoryPostgres(pool, {});
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
      const threadRepository = new CommentRepositoryPostgres(pool, () => "123");
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

      const threadRepository = new CommentRepositoryPostgres(pool, {});
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

      const threadRepository = new CommentRepositoryPostgres(pool, {});
      expect(threadRepository.verifyCommentOwner(payload)).resolves.not.toThrow(
        AuthorizationError
      );
    });
  });

  describe("getDetailCommentByThreadId", () => {
    it("should return comments of thread", async () => {
      // arrange
      /** add thread */
      const threadPayload = {
        id: "thread-available-123",
        ownerId: "comment-owner",
      };
      await ThreadsTableTestHelper.addThread(threadPayload);

      await CommentsTableHelper.addComments({
        id: "comment-coba-1",
        threadId: threadPayload.id,
        ownerId: "comment-owner",
        isAddThread: false,
      });
      await CommentsTableHelper.addComments({
        id: "comment-coba-2",
        threadId: threadPayload.id,
        ownerId: "comment-owner",
        isAddThread: false,
      });
      await CommentsTableHelper.addComments({
        id: "comment-coba-3",
        threadId: threadPayload.id,
        ownerId: "comment-owner",
        isAddThread: false,
      });

      // action
      const threadRepository = new CommentRepositoryPostgres(pool, {});
      const comments = await threadRepository.getDetailCommentByThreadId(
        threadPayload.id
      );

      // assert
      expect(comments.length).toEqual(3);
    });
  });
});
