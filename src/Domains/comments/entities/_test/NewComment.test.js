import NewComment from '../NewComment.js';

describe('a NewComment entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    expect(() => new NewComment({})).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    expect(() => new NewComment({ content: ['comment'] })).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create newComment object correctly', () => {
    expect(new NewComment({ content: 'comment' })).toEqual({ content: 'comment' });
  });
});
