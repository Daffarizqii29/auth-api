class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCaseParam, owner) {
    const { threadId, commentId } = useCaseParam;

    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyAvailableCommentInThread(commentId, threadId);
    await this._commentRepository.verifyCommentOwner(commentId, owner);

    await this._commentRepository.deleteComment(commentId);
  }
}

export default DeleteCommentUseCase;
