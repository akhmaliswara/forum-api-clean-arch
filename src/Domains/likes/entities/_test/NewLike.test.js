const NewLike = require('../NewLike');

describe('NewLike entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123'
    };

    // Action & Assert
    expect(() => new NewLike(payload)).toThrowError('NEW_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
      commentId: 123
    };

    // Action & Assert
    expect(() => new NewLike(payload)).toThrowError('NEW_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewLike entities correctly', () => {
    // Arrange
    const payload = {
      content: 'content',
      owner: 'user-123',
      commentId: 'comment-123'
    };

    // Action
    const newLike = new NewLike(payload);

    // Assert
    expect(newLike).toBeInstanceOf(NewLike);
    expect(newLike.commentId).toEqual(payload.commentId);
    expect(newLike.owner).toEqual(payload.owner);
  });
});
