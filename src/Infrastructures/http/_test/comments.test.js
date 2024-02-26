const pool = require('../../database/postgres/pool')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const container = require('../../container')
const createServer = require('../createServer')
const AuthenticationTokenManager = require('../../../Applications/security/AuthenticationTokenManager')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')

describe('threads/{threadId}/comments endpoint', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({})
    await ThreadsTableTestHelper.addThread({})
  })

  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  describe('when POST threads/{threadId}/comments', () => {
    it('should response 201 and persisted comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'content'
      }
      const threadId = 'thread-123'

      const server = await createServer(container)
      const accessToken = await container.getInstance(AuthenticationTokenManager.name).createAccessToken({ username: 'dicoding' })

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedComment).toBeDefined()
    })

    it('should response 401 when request has no token', async () => {
      // Arrange
      const requestPayload = {
        content: 'content'
      }
      const threadId = 'thread-123'

      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload
      })

      // Assert
      expect(response.statusCode).toEqual(401)
    })

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {}
      const threadId = 'thread-123'

      const server = await createServer(container)
      const accessToken = await container.getInstance(AuthenticationTokenManager.name).createAccessToken({ username: 'dicoding' })

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
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

    it('should response 404 when request thread id is not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'content'
      }
      const threadId = 'thread-1234'

      const server = await createServer(container)
      const accessToken = await container.getInstance(AuthenticationTokenManager.name).createAccessToken({ username: 'dicoding' })

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
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

  describe('when POST threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 if threadId and commentId is exist', async () => {
      await CommentsTableTestHelper.addComment({})

      // Arrange
      const threadId = 'thread-123'
      const commentId = 'comment-123'

      const server = await createServer(container)
      const accessToken = await container.getInstance(AuthenticationTokenManager.name).createAccessToken({ username: 'dicoding' })

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
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
