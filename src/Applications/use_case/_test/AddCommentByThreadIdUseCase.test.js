const AddCommentByThreadIdUseCase = require("../AddCommentByThreadIdUseCase");
const RegisterComment = require("../../../Domains/threads/entities/RegisterCommentEntity");
const RegisteredComment = require("../../../Domains/threads/entities/RegisteredCommentEntity");

const ThreadRepository = require("../../../Infrastructures/repository/ThreadRepositoryPostgres");
const UserRepository = require("../../../Infrastructures/repository/UserRepositoryPostgres");

describe("AddCommentByThreadIdUseCase", () => {
  it("should orchestrating the add comment by thread id use case", async () => {
    // arrange
    const useCasePayload = {
      content: "a-content-comment",
    };

    const useCaseParam = {
      id: "thread-comment-123",
    };
    const useCaseCredential = {
      id: "user-comment-123",
    };

    const mockRegisterComment = new RegisterComment({
      content: useCasePayload.content,
      threadId: useCaseParam.id,
      owner: useCaseCredential.id,
    });

    const mockRegisteredComment = new RegisteredComment({
      id: "comment-123",
      thread_id: useCaseParam.id,
      content: useCasePayload.content,
      date: {},
      is_delete: false,
      owner: useCaseCredential.id,
    });

    /**mocking */
    const mockUserRepository = new UserRepository();
    const mockThreadRepository = new ThreadRepository();

    mockUserRepository.verifyAvailableUserId = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.verifyAvailableThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.addCommentByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockRegisteredComment));

    // action
    const addCommentByThreadIdUseCase = new AddCommentByThreadIdUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
    });

    const registeredComment = await addCommentByThreadIdUseCase.execute(
      useCasePayload,
      useCaseParam,
      useCaseCredential
    );

    // assert
    expect(registeredComment).toStrictEqual(mockRegisteredComment);
    expect(mockUserRepository.verifyAvailableUserId).toBeCalledWith(
      useCaseCredential.id
    );
    expect(mockThreadRepository.verifyAvailableThreadId).toBeCalledWith(
      useCaseParam.id
    );
    expect(mockThreadRepository.addCommentByThreadId).toBeCalledWith(
      mockRegisterComment
    );
  });
});