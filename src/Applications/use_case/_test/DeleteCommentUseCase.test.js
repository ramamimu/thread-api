const DeleteCommentUseCase = require("../DeleteCommentUseCase");

const ThreadRepository = require("../../../Infrastructures/repository/ThreadRepositoryPostgres");
const UserRepository = require("../../../Infrastructures/repository/UserRepositoryPostgres");
const CommentRepository = require("../../../Infrastructures/repository/CommentRepositoryPostgres");

const DeleteCommentEntity = require("../../../Domains/threads/entities/DeleteCommentEntity");

describe("DeleteCommentUseCass", () => {
  it("should orchestrating the delete of comment", async () => {
    const useCaseParams = {
      threadId: "comment-thread-id",
      commentId: "comment-id",
    };

    const useCaseCredential = {
      id: "user-comment-123",
    };

    const deleteCommentEntity = new DeleteCommentEntity({
      threadId: useCaseParams.threadId,
      commentId: useCaseParams.commentId,
      ownerId: useCaseCredential.id,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockUserRepository = new UserRepository();
    const mockCommentRepository = new CommentRepository();

    mockUserRepository.verifyAvailableUserId = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.verifyAvailableThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAvailableCommentId = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteCommentByCommentId = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
      commentRepository: mockCommentRepository,
    });

    await deleteCommentUseCase.execute(useCaseParams, useCaseCredential);
    expect(mockUserRepository.verifyAvailableUserId).toBeCalledWith(
      useCaseCredential.id
    );
    expect(mockThreadRepository.verifyAvailableThreadId).toBeCalledWith(
      useCaseParams.threadId
    );
    expect(mockCommentRepository.verifyAvailableCommentId).toBeCalledWith(
      useCaseParams.commentId
    );
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(
      deleteCommentEntity
    );
    expect(mockCommentRepository.deleteCommentByCommentId).toBeCalledWith(
      deleteCommentEntity
    );
  });
});
