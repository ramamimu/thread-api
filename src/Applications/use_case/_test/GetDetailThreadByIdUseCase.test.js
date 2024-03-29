const DetailThreadEntity = require("../../../Domains/threads/entities/DetailThreadEntity");
const DetailCommentEntity = require("../../../Domains/comments/entities/DetailCommentEntity");

const GetDetailThreadById = require("../GetDetailThreadUseCase");

const ThreadRepository = require("../../../Infrastructures/repository/ThreadRepositoryPostgres");
const CommentRepository = require("../../../Infrastructures/repository/CommentRepositoryPostgres");

describe("GetDetailThreadById usecase", () => {
  it("should orchestrasting get detail thread by id", async () => {
    // arrange
    const threadId = "thread-detail-123";

    const detailCommentPayload = {
      id: "comment-123-id",
      username: "a-uname",
      date: {},
      content: "an-content",
      is_delete: false,
    };

    const detailThreadPayload = {
      id: threadId,
      title: "sebuah thread",
      body: "sebuah body thread",
      date: {},
      username: "dicoding",
      comments: [],
    };

    const mockDetailComment = new DetailCommentEntity(detailCommentPayload);
    const mockDetailThread = new DetailThreadEntity({
      ...detailThreadPayload,
      comments: [mockDetailComment],
    });

    /** mocking dependencies for injection usecase class*/
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyAvailableThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.getDetailCommentByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve([mockDetailComment]));
    mockThreadRepository.getDetailThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockDetailThread));

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
    expect(detailThread.comments.length).toEqual(1);
    expect(detailThread).toStrictEqual(
      new DetailThreadEntity({
        ...detailThreadPayload,
        comments: [new DetailCommentEntity(detailCommentPayload)],
      })
    );
  });
});
