import { describe, it, expect, vi } from 'vitest';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ReplyRepository from '../../../Domains/replies/ReplyRepository.js';
import GetThreadDetailUseCase from '../GetThreadDetailUseCase.js';

describe('GetThreadDetailUseCase', () => {
  it('should orchestrating the get thread detail action correctly', async () => {
    const useCaseParam = { threadId: 'thread-123' };
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyAvailableThread = vi.fn().mockResolvedValue();
    mockThreadRepository.getThreadDetailById = vi.fn().mockResolvedValue({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    });

    mockCommentRepository.getCommentsByThreadId = vi.fn().mockResolvedValue([
      {
        id: 'comment-123',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        content: 'komentar asli',
        isDelete: true,
        likeCount: 0,
      },
    ]);

    mockReplyRepository.getRepliesByCommentIds = vi.fn().mockResolvedValue([
      {
        id: 'reply-123',
        commentId: 'comment-123',
        username: 'dicoding',
        date: '2021-08-08T07:59:18.982Z',
        content: 'balasan asli',
        isDelete: true,
      },
    ]);

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const thread = await getThreadDetailUseCase.execute(useCaseParam);

    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCaseParam.threadId);
    expect(mockThreadRepository.getThreadDetailById).toBeCalledWith(useCaseParam.threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCaseParam.threadId);
    expect(mockReplyRepository.getRepliesByCommentIds).toBeCalledWith(['comment-123']);

    expect(thread).toStrictEqual({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-123',
          username: 'johndoe',
          date: '2021-08-08T07:22:33.555Z',
          content: '**komentar telah dihapus**',
          likeCount: 0,
          replies: [
            {
              id: 'reply-123',
              username: 'dicoding',
              date: '2021-08-08T07:59:18.982Z',
              content: '**balasan telah dihapus**',
            },
          ],
        },
      ],
    });
  });

  it('should return original content and empty replies when comment and reply are not deleted', async () => {
    const useCaseParam = { threadId: 'thread-123' };
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyAvailableThread = vi.fn().mockResolvedValue();
    mockThreadRepository.getThreadDetailById = vi.fn().mockResolvedValue({
      id: 'thread-123',
      title: 'thread kedua',
      body: 'isi body',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    });

    mockCommentRepository.getCommentsByThreadId = vi.fn().mockResolvedValue([
      {
        id: 'comment-123',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        content: 'komentar asli',
        isDelete: false,
        likeCount: 0,
      },
    ]);

    mockReplyRepository.getRepliesByCommentIds = vi.fn().mockResolvedValue([]);

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const thread = await getThreadDetailUseCase.execute(useCaseParam);

    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCaseParam.threadId);
    expect(mockThreadRepository.getThreadDetailById).toBeCalledWith(useCaseParam.threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCaseParam.threadId);
    expect(mockReplyRepository.getRepliesByCommentIds).toBeCalledWith(['comment-123']);

    expect(thread).toStrictEqual({
      id: 'thread-123',
      title: 'thread kedua',
      body: 'isi body',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-123',
          username: 'johndoe',
          date: '2021-08-08T07:22:33.555Z',
          content: 'komentar asli',
          likeCount: 0,
          replies: [],
        },
      ],
    });
  });

  it('should return likeCount from like_count field when provided', async () => {
    const useCaseParam = { threadId: 'thread-123' };
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyAvailableThread = vi.fn().mockResolvedValue();
    mockThreadRepository.getThreadDetailById = vi.fn().mockResolvedValue({
      id: 'thread-123',
      title: 'thread ketiga',
      body: 'isi body ketiga',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    });

    mockCommentRepository.getCommentsByThreadId = vi.fn().mockResolvedValue([
      {
        id: 'comment-123',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        content: 'komentar dengan like_count',
        isDelete: false,
        like_count: '2',
      },
    ]);

    mockReplyRepository.getRepliesByCommentIds = vi.fn().mockResolvedValue([]);

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const thread = await getThreadDetailUseCase.execute(useCaseParam);

    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCaseParam.threadId);
    expect(mockThreadRepository.getThreadDetailById).toBeCalledWith(useCaseParam.threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCaseParam.threadId);
    expect(mockReplyRepository.getRepliesByCommentIds).toBeCalledWith(['comment-123']);

    expect(thread).toStrictEqual({
      id: 'thread-123',
      title: 'thread ketiga',
      body: 'isi body ketiga',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-123',
          username: 'johndoe',
          date: '2021-08-08T07:22:33.555Z',
          content: 'komentar dengan like_count',
          likeCount: 2,
          replies: [],
        },
      ],
    });
  });

  it('should return default likeCount 0 when like_count and likeCount are not provided', async () => {
    const useCaseParam = { threadId: 'thread-123' };
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyAvailableThread = vi.fn().mockResolvedValue();
    mockThreadRepository.getThreadDetailById = vi.fn().mockResolvedValue({
      id: 'thread-123',
      title: 'thread keempat',
      body: 'isi body keempat',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    });

    mockCommentRepository.getCommentsByThreadId = vi.fn().mockResolvedValue([
      {
        id: 'comment-123',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        content: 'komentar tanpa like field',
        isDelete: false,
      },
    ]);

    mockReplyRepository.getRepliesByCommentIds = vi.fn().mockResolvedValue([]);

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const thread = await getThreadDetailUseCase.execute(useCaseParam);

    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCaseParam.threadId);
    expect(mockThreadRepository.getThreadDetailById).toBeCalledWith(useCaseParam.threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCaseParam.threadId);
    expect(mockReplyRepository.getRepliesByCommentIds).toBeCalledWith(['comment-123']);

    expect(thread).toStrictEqual({
      id: 'thread-123',
      title: 'thread keempat',
      body: 'isi body keempat',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-123',
          username: 'johndoe',
          date: '2021-08-08T07:22:33.555Z',
          content: 'komentar tanpa like field',
          likeCount: 0,
          replies: [],
        },
      ],
    });
  });
});