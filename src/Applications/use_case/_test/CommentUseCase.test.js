const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentUseCase = require('../CommentUseCase');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const UserRepository = require('../../../Domains/users/UserRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const userId = 'user-123';
    const username = 'dicoding';
    const threadId = 'thread-123'
    const content = 'This is content'

    const useCasePayload = {
      threadId,
      content
    };

    const mockAddedThread = new AddedThread({
      id: 'thread-123',
      title: 'Title',
      owner: userId
    });

    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      content,
      owner: userId
    });

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockUserRepository = new UserRepository();

    /** mocking needed function */
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));
    mockThreadRepository.getById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread));
    mockUserRepository.getIdByUsername = jest.fn()
      .mockImplementation(() => Promise.resolve(userId));

    /** creating use case instance */
    const commentUseCase = new CommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository
    });

    // Action
    const addedComment = await commentUseCase.addComment(useCasePayload, username);

    // Assert
    expect(addedComment).toStrictEqual(new AddedComment({
      id: 'comment-123',
      content,
      owner: userId
    }));

    expect(mockCommentRepository.addComment).toBeCalledWith(new NewComment({
      threadId: threadId,
      content,
      owner: userId
    }));
  });

  it('should orchestrating the delete comment action correctly when all payload correct', async () => {
    // Arrange
    const userId = 'user-123';
    const username = 'dicoding';
    const threadId = 'thread-123'
    const commentId = 'comment-123'
    const content = 'This is content'

    const useCasePayload = {
      threadId,
      commentId
    };

    const mockAddedThread = {
      id: 'thread-123',
      title: 'Title',
      owner: userId
    };

    const mockAddedComment = {
      id: 'comment-123',
      content,
      owner: userId
    };

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockUserRepository = new UserRepository();

    /** mocking needed function */
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.getById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));
    mockThreadRepository.getById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread));
    mockUserRepository.getIdByUsername = jest.fn()
      .mockImplementation(() => Promise.resolve(userId));

    /** creating use case instance */
    const commentUseCase = new CommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository
    });

    // Action & Assert
    expect(commentUseCase.deleteComment(useCasePayload, username))
      .resolves.not.toThrowError();
  });

  it('should reject delete comment when not all payload correct', async () => {
    // Arrange
    const userId = 'user-123';
    const username = 'dicoding';
    const threadId = 'thread-123'
    const commentId = 'comment-12345'

    const useCasePayload = {
      threadId,
      commentId
    };

    const mockAddedThread = {
      id: 'thread-123',
      title: 'Title',
      owner: userId
    };

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockUserRepository = new UserRepository();

    /** mocking needed function */
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.getById = jest.fn()
      .mockImplementation(() => Promise.reject(new InvariantError()));
    mockThreadRepository.getById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread));
    mockUserRepository.getIdByUsername = jest.fn()
      .mockImplementation(() => Promise.resolve(userId));

    /** creating use case instance */
    const commentUseCase = new CommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository
    });

    // Action & Assert
    expect(commentUseCase.deleteComment(useCasePayload, username))
      .rejects.toThrowError(NotFoundError);
  });

  it('should reject delete comment when user is not comment owner', async () => {
    // Arrange
    const userId = 'user-123';
    const userId2 = "user-1234";
    const username = 'dicoding';
    const threadId = 'thread-123'
    const commentId = 'comment-12345'

    const useCasePayload = {
      threadId,
      commentId
    };

    const mockAddedThread = {
      id: 'thread-123',
      title: 'Title',
      owner: userId
    };

    const mockAddedComment = {
      id: 'comment-123',
      owner: userId2
    };

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockUserRepository = new UserRepository();

    /** mocking needed function */
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.getById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));
    mockThreadRepository.getById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread));
    mockUserRepository.getIdByUsername = jest.fn()
      .mockImplementation(() => Promise.resolve(userId));

    /** creating use case instance */
    const commentUseCase = new CommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository
    });

    // Action & Assert
    expect(commentUseCase.deleteComment(useCasePayload, username))
      .rejects.toThrowError(AuthorizationError);
  });
});
