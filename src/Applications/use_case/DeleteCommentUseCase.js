const DeleteCommentEntity = require("../../Domains/threads/entities/DeleteCommentEntity");

class DeleteCommentUseCase {
  constructor({ threadRepository, userRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCaseParams, useCaseCredentials) {
    const { threadId, commentId } = useCaseParams;
    const { id: credentialId } = useCaseCredentials;
    const deleteCommentEntity = new DeleteCommentEntity({
      threadId,
      commentId,
      ownerId: credentialId,
    });
    await this._userRepository.verifyAvailableUserId(credentialId);
    await this._threadRepository.verifyAvailableThreadId(threadId);
    await this._commentRepository.verifyAvailableCommentId(commentId);
    await this._commentRepository.verifyCommentOwner(deleteCommentEntity);
    await this._commentRepository.deleteCommentByCommentId(deleteCommentEntity);
  }
}

module.exports = DeleteCommentUseCase;
