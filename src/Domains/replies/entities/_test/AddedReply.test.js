const AddedReply = require('../AddedReply');

describe('AddedReply entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'content',
    };

    // Action & Assert
    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 'content',
      id: 1234,
      owner: 'user-123'
    };

    // Action & Assert
    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedReply entities correctly', () => {
    // Arrange
    const payload = {
      content: 'content',
      id: 'reply-123',
      owner: 'user-123'
    };

    // Action
    const addedReply = new AddedReply(payload);

    // Assert
    expect(addedReply).toBeInstanceOf(AddedReply);
    expect(addedReply.content).toEqual(payload.content);
    expect(addedReply.id).toEqual(payload.id);
    expect(addedReply.owner).toEqual(payload.owner);
  });
});
