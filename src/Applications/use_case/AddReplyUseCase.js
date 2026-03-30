import NewReply from '../../Domains/replies/entities/NewReply.js';

class AddReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload, useCaseParam, owner) {
    const { threadId, commentId } = useCaseParam;
    const newReply = new NewReply(useCasePayload);

    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyAvailableCommentInThread(commentId, threadId);

    return this._replyRepository.addReply({
      ...newReply,
      commentId,
      owner,
    });
  }
}

export default AddReplyUseCase;
