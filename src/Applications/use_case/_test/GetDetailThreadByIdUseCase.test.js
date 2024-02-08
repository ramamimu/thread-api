const GetDetailThreadById = require("../GetDetailThreadUseCase");

const ThreadRepository = require("../../../Infrastructures/repository/ThreadRepositoryPostgres");
const CommentRepository = require("../../../Infrastructures/repository/CommentRepositoryPostgres");

describe("GetDetailThreadById usecase", () => {
  it("should orchestrasting get detail thread by id", async () => {
    // arrange
    const threadId = "thread-detail-123";

    /** mocking dependencies for injection usecase class*/
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyAvailableThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.getDetailCommentByThreadId = jest
      .fn()
      .mockImplementation(() => [{ id: "comment-123-id" }]);
    mockThreadRepository.getDetailThreadById = jest
      .fn()
      .mockImplementation(() => ({ id: threadId }));

    // action
    const getDetailThreadById = new GetDetailThreadById({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });
    const detailThread = await getDetailThreadById.execute({ threadId });

    expect(mockThreadRepository.verifyAvailableThreadId).toBeCalledWith(
      threadId
    );
    expect(mockThreadRepository.verifyAvailableThreadId).toBeCalledWith(
      threadId
    );
    expect(mockCommentRepository.getDetailCommentByThreadId).toBeCalledWith(
      threadId
    );
    expect(mockThreadRepository.getDetailThreadById).toBeCalledWith(threadId);
    expect(detailThread.id).toBeDefined();
    expect(detailThread.comments).toBeDefined();
  });
});
