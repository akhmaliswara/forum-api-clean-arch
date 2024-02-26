const pool = require('../../database/postgres/pool')
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const container = require('../../container')
const createServer = require('../createServer')
const AuthenticationTokenManager = require('../../../Applications/security/AuthenticationTokenManager')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')

describe('threads/{threadId}/comments/{commentId}/replies endpoint', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({})
    await ThreadsTableTestHelper.addThread({})
    await CommentsTableTestHelper.addComment({})
  })

  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  describe('when POST threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and persisted reply', async () => {
      // Arrange
      const requestPayload = {
        content: 'content'
      }
      const threadId = 'thread-123'
      const commentId = 'comment-123'

      const server = await createServer(container)
      const accessToken = await container.getInstance(AuthenticationTokenManager.name).createAccessToken({ username: 'dicoding' })

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedReply).toBeDefined()
    })

    it('should response 401 when request has no token', async () => {
      // Arrange
      const requestPayload = {
        content: 'content'
      }
      const threadId = 'thread-123'
      const commentId = 'comment-123'

      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload
      })

      // Assert
      expect(response.statusCode).toEqual(401)
    })

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {}
      const threadId = 'thread-123'
      const commentId = 'comment-123'

      const server = await createServer(container)
      const accessToken = await container.getInstance(AuthenticationTokenManager.name).createAccessToken({ username: 'dicoding' })

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
    })

    it('should response 404 when request comment id is not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'content'
      }
      const threadId = 'thread-123'
      const commentId = 'comment-1234'

      const server = await createServer(container)
      const accessToken = await container.getInstance(AuthenticationTokenManager.name).createAccessToken({ username: 'dicoding' })

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
    })
  })

  describe('when POST threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 200 if threadId and replyId is exist', async () => {
      await RepliesTableTestHelper.addReply({})

      // Arrange
      const threadId = 'thread-123'
      const commentId = 'comment-123'
      const replyId = 'reply-123'

      const server = await createServer(container)
      const accessToken = await container.getInstance(AuthenticationTokenManager.name).createAccessToken({ username: 'dicoding' })

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
    })
  })
})
