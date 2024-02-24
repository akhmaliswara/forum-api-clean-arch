const LikeRepository = require('../../../Domains/likes/LikeRepository');
const LikeUseCase = require('../LikeUseCase');
const NewLike = require('../../../Domains/likes/entities/NewLike');
const AddedLike = require('../../../Domains/likes/entities/AddedLike');
const UserRepository = require('../../../Domains/users/UserRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('LikeUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add like action correctly', async () => {
    // Arrange
    const userId = 'user-123';
    const username = 'dicoding';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const likeId = 'like-123';

    const useCasePayload = {
      threadId,
      commentId,
    };
    
    const mockAddedLike = new AddedLike({
      id: likeId,
      owner: userId
    });

    /** creating dependency of use case */
    const mockLikeRepository = new LikeRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockUserRepository = new UserRepository();

    /** mocking needed function */
    mockLikeRepository.addLike = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedLike));
    mockLikeRepository.getByCommentAndOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAvailableCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.verifyAvailableThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockUserRepository.getIdByUsername = jest.fn()
      .mockImplementation(() => Promise.resolve(userId));

    /** creating use case instance */
    const likeUseCase = new LikeUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository
    });

    // Action
    const addedLike = await likeUseCase.likeOrUnlike(useCasePayload, username);

    // Assert
    expect(addedLike).toStrictEqual(new AddedLike({
      id: likeId,
      owner: userId
    }));

    expect(mockLikeRepository.addLike).toBeCalledWith(new NewLike({
      commentId,
      owner: userId
    }));
  });

  it('should throw not found error if thread not found', async () => {
    // Arrange
    const userId = 'user-123';
    const commentId = 'commentId-123';
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
    const mockLikeRepository = new LikeRepository();
    const mockUserRepository = new UserRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThreadId = jest.fn()
      .mockImplementation(() => Promise.reject(new NotFoundError()));
    mockCommentRepository.getByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComment));
    mockUserRepository.getIdByUsername = jest.fn()
      .mockImplementation(() => Promise.resolve(userId));

    /** creating use case instance */
    const likeUseCase = new LikeUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository
    });

    // Action & Assert
    expect(likeUseCase.likeOrUnlike(commentId))
      .rejects.toThrowError(NotFoundError);
  });

  it('should orchestrating the unlike action correctly when all payload correct', async () => {
    // Arrange
    const userId = 'user-123';
    const username = 'dicoding';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const likeId = 'like-123';

    const useCasePayload = {
      threadId,
      commentId,
    };
    
    const mockAddedLike = {
      id: likeId,
      owner: userId
    };

    const mockDeletedLike = {
      id: likeId,
      owner: userId,
      is_deleted: true
    };

    /** creating dependency of use case */
    const mockLikeRepository = new LikeRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockUserRepository = new UserRepository();

    /** mocking needed function */
    mockLikeRepository.deleteLike = jest.fn()
      .mockImplementation(() => Promise.resolve(mockDeletedLike));
    mockLikeRepository.getByCommentAndOwner = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedLike));
    mockCommentRepository.verifyAvailableCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.verifyAvailableThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockUserRepository.getIdByUsername = jest.fn()
      .mockImplementation(() => Promise.resolve(userId));

    /** creating use case instance */
    const likeUseCase = new LikeUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository
    });

    // Action & Assert
    expect(likeUseCase.likeOrUnlike(useCasePayload, username))
      .resolves.not.toThrowError();
  });

  it('should reject delete like when not all payload correct', async () => {
    // Arrange
    const userId = 'user-123';
    const username = 'dicoding';
    const threadId = 'thread-123';
    const commentId = 'comment-123';

    const useCasePayload = {
      threadId,
      commentId
    };

    const mockAddedThread = {
      id: threadId,
      owner: userId
    };

    /** creating dependency of use case */
    const mockLikeRepository = new LikeRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockUserRepository = new UserRepository();

    /** mocking needed function */
    mockLikeRepository.deleteLike = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.getByCommentAndOwner = jest.fn()
      .mockImplementation(() => Promise.reject(new InvariantError()));
    mockCommentRepository.verifyAvailableCommentId = jest.fn()
      .mockImplementation(() => Promise.reject(new NotFoundError()));
    mockThreadRepository.verifyAvailableThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread));
    mockUserRepository.getIdByUsername = jest.fn()
      .mockImplementation(() => Promise.resolve(userId));

    /** creating use case instance */
    const likeUseCase = new LikeUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository
    });

    // Action & Assert
    expect(likeUseCase.likeOrUnlike(useCasePayload, username))
      .rejects.toThrowError(NotFoundError);
  });
});
