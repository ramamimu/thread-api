const RegisterComment = require("../../Domains/threads/entities/RegisterCommentEntity");

class AddCommentByThreadIdUseCase {
  constructor({ threadRepository, userRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
    this._commentRepository = commentRepository;
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
    const RegisteredComment =
      await this._commentRepository.addCommentByThreadId(registerComment);
    return RegisteredComment;
  }
}

module.exports = AddCommentByThreadIdUseCase;
