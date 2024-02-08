const GetDetailThreadById = require("../GetDetailThreadUseCase");
const ThreadRepository = require("../../../Infrastructures/repository/ThreadRepositoryPostgres");

describe("GetDetailThreadById usecase", () => {
  it("should orchestrasting get detail thread by id", async () => {
    // arrange
    const threadId = "thread-detail-123";

    /** mocking dependencies for injection usecase class*/
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.verifyAvailableThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getDetailCommentByThreadId = jest
      .fn()
      .mockImplementation(() => [{ id: "comment-123-id" }]);
    mockThreadRepository.getDetailThreadById = jest
      .fn()
      .mockImplementation(() => ({ id: threadId }));

    // action
    const getDetailThreadById = new GetDetailThreadById({
      threadRepository: mockThreadRepository,
    });
    const detailThread = await getDetailThreadById.execute({ threadId });

    expect(mockThreadRepository.verifyAvailableThreadId).toBeCalledWith(
      threadId
    );
    expect(mockThreadRepository.getDetailThreadById).toBeCalledWith(threadId);
    expect(detailThread.id).toBeDefined();
    expect(detailThread.comments).toBeDefined();
  });
});
