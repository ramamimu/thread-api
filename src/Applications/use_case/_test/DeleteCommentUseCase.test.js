const DeleteCommentUseCase = require("../DeleteCommentUseCase");

const ThreadRepository = require("../../../Infrastructures/repository/ThreadRepositoryPostgres");
const UserRepository = require("../../../Infrastructures/repository/UserRepositoryPostgres");

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

    mockUserRepository.verifyAvailableUserId = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.verifyAvailableThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.verifyAvailableCommentId = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.verifyCommentOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.deleteCommentByCommentId = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
    });

    await deleteCommentUseCase.execute(useCaseParams, useCaseCredential);
    expect(mockUserRepository.verifyAvailableUserId).toBeCalledWith(
      useCaseCredential.id
    );
    expect(mockThreadRepository.verifyAvailableThreadId).toBeCalledWith(
      useCaseParams.threadId
    );
    expect(mockThreadRepository.verifyAvailableCommentId).toBeCalledWith(
      useCaseParams.commentId
    );
    expect(mockThreadRepository.deleteCommentByCommentId).toBeCalledWith(
      deleteCommentEntity
    );
  });
});
