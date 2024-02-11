const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ReplyUseCase = require('../ReplyUseCase');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const UserRepository = require('../../../Domains/users/UserRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('ReplyUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const userId = 'user-123';
    const username = 'dicoding';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const replyId = 'reply-123';
    const content = 'This is content';

    const useCasePayload = {
      commentId,
      content
    };

    const mockAddedThread = new AddedThread({
      id: threadId,
      title: 'Title',
      owner: userId
    });

    const mockAddedComment = new AddedComment({
      id: replyId,
      content,
      owner: userId
    });
    
    const mockAddedReply = new AddedReply({
      id: replyId,
      content,
      owner: userId
    });

    /** creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockUserRepository = new UserRepository();

    /** mocking needed function */
    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedReply));
    mockCommentRepository.getById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));
    mockThreadRepository.getById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread));
    mockUserRepository.getIdByUsername = jest.fn()
      .mockImplementation(() => Promise.resolve(userId));

    /** creating use case instance */
    const replyUseCase = new ReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository
    });

    // Action
    const addedReply = await replyUseCase.addReply(useCasePayload, username);

    // Assert
    expect(addedReply).toStrictEqual(new AddedReply({
      id: replyId,
      content,
      owner: userId
    }));

    expect(mockReplyRepository.addReply).toBeCalledWith(new NewReply({
      commentId,
      content,
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
    const mockReplyRepository = new ReplyRepository();
    const mockUserRepository = new UserRepository();

    /** mocking needed function */
    mockThreadRepository.getById = jest.fn()
      .mockImplementation(() => Promise.reject(new InvariantError()));
    mockCommentRepository.getByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComment));
    mockUserRepository.getIdByUsername = jest.fn()
      .mockImplementation(() => Promise.resolve(userId));

    /** creating use case instance */
    const replyUseCase = new ReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository
    });

    // Action & Assert
    expect(replyUseCase.addReply(commentId))
      .rejects.toThrowError(NotFoundError);
  });

  it('should orchestrating the delete reply action correctly when all payload correct', async () => {
    // Arrange
    const userId = 'user-123';
    const username = 'dicoding';
    const threadId = 'thread-123'
    const commentId = 'comment-123';
    const replyId = 'reply-123';
    const content = 'This is content';

    const useCasePayload = {
      threadId,
      commentId,
      replyId
    };

    const mockAddedThread = {
      id: threadId,
      title: 'Title',
      owner: userId
    };

    const mockAddedComment = {
      id: commentId,
      content,
      owner: userId
    };
    
    const mockAddedReply = {
      id: replyId,
      content,
      owner: userId
    };

    /** creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockUserRepository = new UserRepository();

    /** mocking needed function */
    mockReplyRepository.deleteReply = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.getById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedReply));
    mockCommentRepository.getById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));
    mockThreadRepository.getById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread));
    mockUserRepository.getIdByUsername = jest.fn()
      .mockImplementation(() => Promise.resolve(userId));

    /** creating use case instance */
    const replyUseCase = new ReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository
    });

    // Action & Assert
    expect(replyUseCase.deleteReply(useCasePayload, username))
      .resolves.not.toThrowError();
  });

  it('should reject delete reply when not all payload correct', async () => {
    // Arrange
    const userId = 'user-123';
    const username = 'dicoding';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const replyId = 'reply-12345';

    const useCasePayload = {
      threadId,
      commentId,
      replyId
    };

    const mockAddedComment = {
      id: commentId,
      content: 'content',
      owner: userId
    };

    const mockAddedThread = {
      id: threadId,
      title: 'Title',
      owner: userId
    };

    /** creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockUserRepository = new UserRepository();

    /** mocking needed function */
    mockReplyRepository.deleteReply = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.getById = jest.fn()
      .mockImplementation(() => Promise.reject(new InvariantError()));
    mockCommentRepository.getById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));
      mockThreadRepository.getById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread));
    mockUserRepository.getIdByUsername = jest.fn()
      .mockImplementation(() => Promise.resolve(userId));

    /** creating use case instance */
    const replyUseCase = new ReplyUseCase({
      replyRepository: mockReplyRepository,
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository
    });

    // Action & Assert
    expect(replyUseCase.deleteReply(useCasePayload, username))
      .rejects.toThrowError(NotFoundError);
  });

  it('should reject delete reply when user is not reply owner', async () => {
    // Arrange
    const userId = 'user-123';
    const userId2 = "user-1234";
    const username = 'dicoding';
    const threadId = 'thread-123'
    const commentId = 'comment-123';
    const replyId = 'reply-12345'

    const useCasePayload = {
      threadId,
      commentId,
      replyId
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

    const mockAddedReply = {
      id: 'reply-123',
      owner: userId2
    };

    /** creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockUserRepository = new UserRepository();

    /** mocking needed function */
    mockReplyRepository.deleteReply = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.getById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedReply));
    mockCommentRepository.getById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));
    mockThreadRepository.getById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread));
    mockUserRepository.getIdByUsername = jest.fn()
      .mockImplementation(() => Promise.resolve(userId));

    /** creating use case instance */
    const replyUseCase = new ReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository
    });

    // Action & Assert
    expect(replyUseCase.deleteReply(useCasePayload, username))
      .rejects.toThrowError(AuthorizationError);
  });
});
