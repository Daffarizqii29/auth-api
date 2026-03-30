import NewReply from '../NewReply.js';

describe('a NewReply entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    expect(() => new NewReply({})).toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    expect(() => new NewReply({ content: ['reply'] })).toThrowError('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create newReply object correctly', () => {
    expect(new NewReply({ content: 'reply' })).toEqual({ content: 'reply' });
  });
});
