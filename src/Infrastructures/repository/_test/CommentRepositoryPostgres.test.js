const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const InvariantError = require('../../../Commons/exceptions/InvariantError')
const NewComment = require('../../../Domains/comments/entities/NewComment')
const AddedComment = require('../../../Domains/comments/entities/AddedComment')
const pool = require('../../database/postgres/pool')
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')

describe('CommentRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({})
    await ThreadsTableTestHelper.addThread({})
  })

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('addComment function', () => {
    it('should persist comment and return added comment correctly', async () => {
      // Arrange
      const newComment = new NewComment({
        threadId: 'thread-123',
        content: 'Dicoding Indonesia',
        owner: 'user-123'
      })
      const fakeIdGenerator = () => '123' // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(newComment)

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'Dicoding Indonesia',
        owner: 'user-123'
      }))

      const comments = await CommentsTableTestHelper.findCommentsById('comment-123')
      expect(comments).toHaveLength(1)
      expect(comments[0].id).toBe('comment-123')
      expect(comments[0].content).toBe('Dicoding Indonesia')
      expect(comments[0].owner).toBe('user-123')
    })
  })

  describe('getById function', () => {
    it('should throw InvariantError when commentId not found', () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action & Assert
      return expect(commentRepositoryPostgres.getById(''))
        .rejects
        .toThrowError(InvariantError)
    })

    it('should return object when comment is found', async () => {
      // Arrange
      const fakeIdGenerator = () => '123' // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator)

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        threadId: 'thread-123',
        content: 'Dicoding Indonesia'
      })

      // Action & Assert
      const comment = await commentRepositoryPostgres.getById('comment-123')
      expect(comment).toBeInstanceOf(Object)
      expect(comment.id).toBe('comment-123')
      expect(comment.content).toBe('Dicoding Indonesia')
      expect(comment.owner).toBe('user-123')
    })
  })

  describe('getByThreadId function', () => {
    it('should return object when comment is found', async () => {
      // Arrange
      const fakeIdGenerator = () => '123' // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator)

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        threadId: 'thread-123',
        content: 'Dicoding Indonesia'
      })

      // Action & Assert
      const comment = await commentRepositoryPostgres.getByThreadId('thread-123')
      expect(Array.isArray(comment)).toBe(true)
      expect(comment).toHaveLength(1)
      expect(comment[0].id).toBe('comment-123')
      expect(comment[0].content).toBe('Dicoding Indonesia')
      expect(comment[0].owner).toBe('user-123')
    })
  })

  describe('verifyAvailableCommentId function', () => {
    it('should throw NotFoundError when comment not available', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyAvailableCommentId('comment-1234')).rejects.toThrowError(NotFoundError)
    })

    it('should not throw NotFoundError when comment available', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-1234' })
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyAvailableCommentId('comment-1234')).resolves.not.toThrowError(NotFoundError)
    })
  })

  describe('deleteComment function', () => {
    it('should throw NotFound when commentId not found', () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action & Assert
      return expect(commentRepositoryPostgres.deleteComment(''))
        .rejects
        .toThrowError(InvariantError)
    })

    it('should success when comment is found', async () => {
      // Arrange
      const fakeIdGenerator = () => '123' // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator)

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        threadId: 'thread-123',
        body: 'Dicoding Indonesia'
      })

      // Action & Assert
      const deletedComment = await commentRepositoryPostgres.deleteComment('comment-123')
      expect(deletedComment.is_deleted).toBeTruthy()

      const comment = await commentRepositoryPostgres.getById('comment-123')
      expect(comment.is_deleted).toBeTruthy()
    })
  })
})
