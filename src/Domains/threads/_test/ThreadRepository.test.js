const ThreadRepository = require("../ThreadRepository");

describe("ThreadRepository's abstract interface", () => {
  it("should throw error when invoke abstract", async () => {
    // arrange
    const threadRepository = new ThreadRepository();

    // action and assert
    await expect(threadRepository.addThread({})).rejects.toThrowError(
      "THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(threadRepository.getDetailThread("")).rejects.toThrowError(
      "THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
