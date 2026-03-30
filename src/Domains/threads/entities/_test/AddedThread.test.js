import AddedThread from '../AddedThread.js';

describe('an AddedThread entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    expect(() => new AddedThread({ id: 'thread-123', title: 'thread' }))
      .toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    expect(() => new AddedThread({ id: 'thread-123', title: {}, owner: 'user-123' }))
      .toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addedThread object correctly', () => {
    const payload = { id: 'thread-123', title: 'thread', owner: 'user-123' };

    expect(new AddedThread(payload)).toEqual(payload);
  });
});
