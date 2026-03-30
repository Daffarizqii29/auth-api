class ToggleCommentLikeUseCase {
  constructor({ threadRepository, commentRepository, commentLikeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._commentLikeRepository = commentLikeRepository;
  }

  async execute(useCaseParam, owner) {
    const { threadId, commentId } = useCaseParam;

    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyAvailableCommentInThread(commentId, threadId);

    const isLiked = await this._commentLikeRepository.verifyLike(commentId, owner);

    if (isLiked) {
      await this._commentLikeRepository.deleteLike(commentId, owner);
      return;
    }

    await this._commentLikeRepository.addLike(commentId, owner);
  }
}

export default ToggleCommentLikeUseCase;
