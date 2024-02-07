const RegisterComment = require("../../Domains/threads/entities/RegisterCommentEntity");

class AddCommentByThreadIdUseCase {
  constructor({ threadRepository, userRepository }) {
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
  }

  async execute(useCasePayload, useCaseCredentials) {
    const { id: credentialId } = useCaseCredentials;
    await this._userRepository.verifyAvailableThreadId(credentialId);
    const registerComment = new RegisterComment({
      id: credentialId,
      ...useCasePayload,
    });
    await this._threadRepository.verifyThreadExistance(
      registerComment.threadId
    );
    const RegisteredComment = await this._threadRepository.addCommentByThreadId(
      registerComment
    );
    return RegisteredComment;
  }
}

module.exports = AddCommentByThreadIdUseCase;
