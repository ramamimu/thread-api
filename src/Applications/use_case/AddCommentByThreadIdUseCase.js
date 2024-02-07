const RegisterComment = require("../../Domains/threads/entities/RegisterCommentEntity");

class AddCommentByThreadIdUseCase {
  constructor({ threadRepository, userRepository }) {
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
  }

  async execute(useCasePayload, useCaseParam, useCaseCredentials) {
    const { id: credentialId } = useCaseCredentials;
    const { id: threadId } = useCaseParam;
    const { content } = useCasePayload;
    const registerComment = new RegisterComment({
      owner: credentialId,
      threadId,
      content,
    });
    await this._userRepository.verifyAvailableUserId(credentialId);
    await this._threadRepository.verifyAvailableThreadId(
      registerComment.threadId
    );
    const RegisteredComment = await this._threadRepository.addCommentByThreadId(
      registerComment
    );
    return RegisteredComment;
  }
}

module.exports = AddCommentByThreadIdUseCase;
