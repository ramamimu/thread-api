const CommentRepository = require("../CommentRepository");

describe("CommentRepository's abstract interface", () => {
  it("should throw error when invoke abstract", async () => {
    // arrange
    const commentRepository = new CommentRepository();

    // action and assert
    await expect(
      commentRepository.addCommentByThreadId({})
    ).rejects.toThrowError("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(
      commentRepository.verifyAvailableCommentId("")
    ).rejects.toThrowError("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(commentRepository.verifyCommentOwner({})).rejects.toThrowError(
      "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(
      commentRepository.deleteCommentByCommentId({})
    ).rejects.toThrowError("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(
      commentRepository.getDetailCommentByThreadId("")
    ).rejects.toThrowError("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  });
});
