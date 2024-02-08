class GetDetailThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCaseParams) {
    const { threadId } = useCaseParams;
    await this._threadRepository.verifyAvailableThreadId(threadId);
    const comments = await this._threadRepository.getDetailCommentByThreadId(
      threadId
    );
    const thread = await this._threadRepository.getDetailThreadById({
      ...threadId,
      comments,
    });
    return thread;
  }
}
