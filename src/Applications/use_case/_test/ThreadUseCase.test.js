const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadUseCase = require('../ThreadUseCase');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const UserRepository = require('../../../Domains/users/UserRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const InvariantError = require('../../../Commons/exceptions/InvariantError');

describe('ThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const userId = 'user-123';
    const username = 'dicoding';
    const title = 'Title';
    const body = 'Body';

    const useCasePayload = {
      title,
      body
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
      title,
      owner: userId
    }));
  });

  it('should orchestrating the get thread by id correctly', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const title = 'Title';
    const body = 'Body';

    const mockThread = {
      id: 'thread-123',
      title,
      body,
      owner: userId
    };

    const mockComment = [
      {
        id: 'comment-123',
        thread_id: 'thread-123',
        content: title,
        is_deleted: false,
        owner: userId
      },
      {
        id: 'comment-1234',
        thread_id: 'thread-123',
        content: title,
        is_deleted: true,
        owner: userId
      }
    ];

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.getById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComment));

    /** creating use case instance */
    const threadUseCase = new ThreadUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const threads = await threadUseCase.getById(threadId);

    // Assert
    expect(threads).toBeInstanceOf(Object);
    expect(Array.isArray(threads.comments)).toBe(true);
  });

  it('should throw not found error if thread not found', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const title = 'Title';

    const mockComment = [
      {
        id: 'comment-123',
        thread_id: 'thread-123',
        content: title,
        is_deleted: false,
        owner: userId
      },
      {
        id: 'comment-1234',
        thread_id: 'thread-123',
        content: title,
        is_deleted: true,
        owner: userId
      }
    ];

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.getById = jest.fn()
      .mockImplementation(() => Promise.reject(new InvariantError()));
    mockCommentRepository.getByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComment));

    /** creating use case instance */
    const threadUseCase = new ThreadUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    expect(threadUseCase.getById(threadId))
      .rejects.toThrowError(NotFoundError);
  });
});
