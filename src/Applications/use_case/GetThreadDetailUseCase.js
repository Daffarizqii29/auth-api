class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCaseParam) {
    const { threadId } = useCaseParam;

    await this._threadRepository.verifyAvailableThread(threadId);
    const thread = await this._threadRepository.getThreadDetailById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);
    const replies = await this._replyRepository.getRepliesByCommentIds(
      comments.map((comment) => comment.id),
    );

    const repliesByCommentId = replies.reduce((acc, reply) => {
      const currentReplies = acc[reply.commentId] || [];
      currentReplies.push({
        id: reply.id,
        content: (reply.is_delete || reply.isDelete) ? '**balasan telah dihapus**' : reply.content,
        date: reply.date,
        username: reply.username,
      });
      acc[reply.commentId] = currentReplies;
      return acc;
    }, {});

    return {
      ...thread,
      comments: comments.map((comment) => ({
        id: comment.id,
        username: comment.username,
        date: comment.date,
        content: (comment.is_delete || comment.isDelete) ? '**komentar telah dihapus**' : comment.content,
        likeCount: Number(comment.like_count ?? comment.likeCount ?? 0),
        replies: repliesByCommentId[comment.id] || [],
      })),
    };
  }
}

export default GetThreadDetailUseCase;