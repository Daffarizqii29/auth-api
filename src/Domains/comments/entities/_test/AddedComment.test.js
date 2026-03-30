import AddedComment from '../AddedComment.js';

describe('an AddedComment entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    expect(() => new AddedComment({ id: 'comment-123', content: 'comment' }))
      .toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    expect(() => new AddedComment({ id: 'comment-123', content: {}, owner: 'user-123' }))
      .toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addedComment object correctly', () => {
    const payload = { id: 'comment-123', content: 'comment', owner: 'user-123' };

    expect(new AddedComment(payload)).toEqual(payload);
  });
});
