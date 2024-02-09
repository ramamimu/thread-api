const AddThreadUseCase = require("../AddThreadUseCase");
const RegisterThread = require("../../../Domains/threads/entities/RegisterThreadEntity");
const RegisteredThread = require("../../../Domains/threads/entities/RegisteredThread");
const ThreadRepository = require("../../../Infrastructures/repository/ThreadRepositoryPostgres");
const UserRepository = require("../../../Infrastructures/repository/UserRepositoryPostgres");

describe("AddThreadUseCase", () => {
  it("should orchestrating the add thread action correctly", async () => {
    const threadId = "thread-123";
    const useCasePayload = {
      title: "a-title",
      body: "a-body",
    };

    const useCaseCredentials = {
      id: "user-thread-293",
    };

    const mockRegisteredThread = new RegisteredThread({
      id: threadId,
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: useCaseCredentials.id,
      date: {},
    });

    /** create mock dependencies of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockUserRepository = new UserRepository();

    /** create mock function */
    mockThreadRepository.addThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockRegisteredThread));

    mockUserRepository.verifyAvailableUserId = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    /** initiate thread use case with mocker function */
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
    });

    // action
    const registeredThread = await addThreadUseCase.execute(
      useCasePayload,
      useCaseCredentials
    );

    // assert
    expect(registeredThread).toStrictEqual(
      new RegisteredThread({
        id: threadId,
        title: useCasePayload.title,
        body: useCasePayload.body,
        owner: useCaseCredentials.id,
        date: {},
      })
    );

    expect(mockUserRepository.verifyAvailableUserId).toBeCalledWith(
      useCaseCredentials.id
    );
    expect(mockThreadRepository.addThread).toBeCalledWith(
      new RegisterThread(useCasePayload),
      useCaseCredentials.id
    );
  });
});
