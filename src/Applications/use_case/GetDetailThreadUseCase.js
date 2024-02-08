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
    const thread = await this._threadRepository.getDetailThreadById(threadId);
    return this.formatValue({ ...thread, comments });
  }

  formatValue(val) {
    const { comments } = val;
    let deletedContent = [];
    let noDeletedContent = [];
    comments.forEach((item) => {
      if (item.content === "**komentar telah dihapus**")
        deletedContent.push(item);
      else noDeletedContent.push(item);
    });

    return { ...val, comments: [...noDeletedContent, ...deletedContent] };
  }
}

module.exports = GetDetailThreadUseCase;
