const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadUseCase = require('../ThreadUseCase');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const UserRepository = require('../../../Domains/users/UserRepository');

describe('ThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const userId = 'user-123';
    const username = 'dicoding';

    const useCasePayload = {
      title: 'Title',
      body: 'Body'
    };

    const mockAddedThread = new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: userId
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockUserRepository = new UserRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread));
    mockUserRepository.getIdByUsername = jest.fn()
      .mockImplementation(() => Promise.resolve(userId));

    /** creating use case instance */
    const threadUseCase = new ThreadUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository
    });

    // Action
    const addedThread = await threadUseCase.addThread(useCasePayload, username);

    // Assert
    expect(addedThread).toStrictEqual(new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: userId
    }));

    expect(mockThreadRepository.addThread).toBeCalledWith(new NewThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: userId
    }));
  });
});
