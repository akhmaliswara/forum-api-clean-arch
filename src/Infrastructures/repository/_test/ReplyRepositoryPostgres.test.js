const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper')
const InvariantError = require('../../../Commons/exceptions/InvariantError')
const NewReply = require('../../../Domains/replies/entities/NewReply')
const AddedReply = require('../../../Domains/replies/entities/AddedReply')
const pool = require('../../database/postgres/pool')
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')

describe('ReplyRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({})
    await ThreadsTableTestHelper.addThread({})
    await CommentsTableTestHelper.addComment({})
  })

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('addReply function', () => {
    it('should persist reply and return added reply correctly', async () => {
      // Arrange
      const newReply = new NewReply({
        commentId: 'comment-123',
        content: 'Dicoding Indonesia',
        owner: 'user-123'
      })
      const fakeIdGenerator = () => '123' // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(newReply)

      // Assert
      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-123',
        content: 'Dicoding Indonesia',
        owner: 'user-123'
      }))

      const replies = await RepliesTableTestHelper.findRepliesById('reply-123')
      expect(replies).toHaveLength(1)
      expect(replies[0].id).toBe('reply-123')
      expect(replies[0].content).toBe('Dicoding Indonesia')
      expect(replies[0].owner).toBe('user-123')
    })
  })

  describe('getById function', () => {
    it('should throw InvariantError when replyId not found', () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

      // Action & Assert
      return expect(replyRepositoryPostgres.getById(''))
        .rejects
        .toThrowError(InvariantError)
    })

    it('should return object when reply is found', async () => {
      // Arrange
      const fakeIdGenerator = () => '123' // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator)

      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        owner: 'user-123',
        commentId: 'comment-123',
        content: 'Dicoding Indonesia'
      })

      // Action & Assert
      const reply = await replyRepositoryPostgres.getById('reply-123')
      expect(reply).toBeInstanceOf(Object)
      expect(reply.id).toBe('reply-123')
      expect(reply.content).toBe('Dicoding Indonesia')
      expect(reply.owner).toBe('user-123')
    })
  })

  describe('getByThreadId function', () => {
    it('should return object when reply is found', async () => {
      // Arrange
      const fakeIdGenerator = () => '123' // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator)

      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        owner: 'user-123',
        commentId: 'comment-123',
        body: 'Dicoding Indonesia'
      })

      // Action & Assert
      const reply = await replyRepositoryPostgres.getByThreadId('thread-123')
      expect(Array.isArray(reply)).toBe(true)
      expect(reply).toHaveLength(1)
      expect(reply[0].id).toBe('reply-123')
      expect(reply[0].content).toBe('Dicoding Indonesia')
      expect(reply[0].owner).toBe('user-123')
    })
  })

  describe('verifyAvailableReplyId function', () => {
    it('should throw NotFoundError when reply not available', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyAvailableReplyId('reply-1234')).rejects.toThrowError(NotFoundError)
    })

    it('should not throw NotFoundError when reply available', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({ id: 'reply-1234' })
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyAvailableReplyId('reply-1234')).resolves.not.toThrowError(NotFoundError)
    })
  })

  describe('deleteReply function', () => {
    it('should throw NotFound when replyId not found', () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

      // Action & Assert
      return expect(replyRepositoryPostgres.deleteReply(''))
        .rejects
        .toThrowError(InvariantError)
    })

    it('should success when reply is found', async () => {
      // Arrange
      const fakeIdGenerator = () => '123' // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator)

      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        owner: 'user-123',
        commentId: 'comment-123',
        body: 'Dicoding Indonesia'
      })

      // Action & Assert
      const deletedReply = await replyRepositoryPostgres.deleteReply('reply-123')
      expect(deletedReply.is_deleted).toBeTruthy()

      const reply = await replyRepositoryPostgres.getById('reply-123')
      expect(reply.is_deleted).toBeTruthy()
    })
  })
})
