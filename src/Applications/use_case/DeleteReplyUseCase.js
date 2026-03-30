class DeleteReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCaseParam, owner) {
    const { threadId, commentId, replyId } = useCaseParam;

    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyAvailableCommentInThread(commentId, threadId);
    await this._replyRepository.verifyAvailableReplyInComment(replyId, commentId);
    await this._replyRepository.verifyReplyOwner(replyId, owner);

    await this._replyRepository.deleteReply(replyId);
  }
}

export default DeleteReplyUseCase;
