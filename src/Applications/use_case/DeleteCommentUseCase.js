const DeleteCommentEntity = require("../../Domains/threads/entities/DeleteCommentEntity");

class DeleteCommentUseCase {
  constructor({ threadRepository, userRepository }) {
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
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
    await this._threadRepository.verifyAvailableComment(deleteCommentEntity);
    await this._threadRepository.deleteCommentByCommentId(deleteCommentEntity);
  }
}

module.exports = DeleteCommentUseCase;
