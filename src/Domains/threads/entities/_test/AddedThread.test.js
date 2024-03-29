const AddedThread = require('../AddedThread')

describe('AddedThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'title'
    }

    // Action & Assert
    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 'title',
      id: 1234,
      owner: 'user-123'
    }

    // Action & Assert
    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create AddedThread entities correctly', () => {
    // Arrange
    const payload = {
      title: 'title',
      id: 'thread-123',
      owner: 'user-123'
    }

    // Action
    const addedThread = new AddedThread(payload)

    // Assert
    expect(addedThread).toBeInstanceOf(AddedThread)
    expect(addedThread.title).toEqual(payload.title)
    expect(addedThread.id).toEqual(payload.id)
    expect(addedThread.owner).toEqual(payload.owner)
  })
})
