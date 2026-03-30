import NewComment from '../../Domains/comments/entities/NewComment.js';

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload, useCaseParam, owner) {
    const { threadId } = useCaseParam;
    const newComment = new NewComment(useCasePayload);

    await this._threadRepository.verifyAvailableThread(threadId);

    return this._commentRepository.addComment({
      ...newComment,
      threadId,
      owner,
    });
  }
}

export default AddCommentUseCase;
