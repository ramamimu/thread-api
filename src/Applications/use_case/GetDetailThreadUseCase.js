class GetDetailThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCaseParams) {
    const { threadId } = useCaseParams;
    await this._threadRepository.verifyAvailableThreadId(threadId);
    const comments = await this._commentRepository.getDetailCommentByThreadId(
      threadId
    );
    const thread = await this._threadRepository.getDetailThreadById(threadId);
    return { ...thread, comments };
  }
}

module.exports = GetDetailThreadUseCase;
