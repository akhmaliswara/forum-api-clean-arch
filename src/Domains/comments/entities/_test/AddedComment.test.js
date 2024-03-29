const AddedComment = require('../AddedComment')

describe('AddedComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'content'
    }

    // Action & Assert
    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 'content',
      id: 1234,
      owner: 'user-123'
    }

    // Action & Assert
    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create AddedComment entities correctly', () => {
    // Arrange
    const payload = {
      content: 'content',
      id: 'comment-123',
      owner: 'user-123'
    }

    // Action
    const addedComment = new AddedComment(payload)

    // Assert
    expect(addedComment).toBeInstanceOf(AddedComment)
    expect(addedComment.content).toEqual(payload.content)
    expect(addedComment.id).toEqual(payload.id)
    expect(addedComment.owner).toEqual(payload.owner)
  })
})
