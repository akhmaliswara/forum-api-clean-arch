const pool = require('../../database/postgres/pool')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const container = require('../../container')
const createServer = require('../createServer')
const AuthenticationTokenManager = require('../../../Applications/security/AuthenticationTokenManager')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')

describe('/threads endpoint', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({})
  })

  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const requestPayload = {
        title: 'dicoding',
        body: 'Dicoding Indonesia'
      }

      const server = await createServer(container)
      const accessToken = await container.getInstance(AuthenticationTokenManager.name).createAccessToken({ username: 'dicoding' })

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedThread).toBeDefined()
    })

    it('should response 401 when request has no token', async () => {
      // Arrange
      const requestPayload = {
        title: 'dicoding',
        body: 'Dicoding Indonesia'
      }

      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload
      })

      // Assert
      expect(response.statusCode).toEqual(401)
    })

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        title: 'dicoding'
      }
      const server = await createServer(container)
      const accessToken = await container.getInstance(AuthenticationTokenManager.name).createAccessToken({ username: 'dicoding' })

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
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
  })

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 and data retrieved', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({})
      await CommentsTableTestHelper.addComment({})
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123'
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.thread).toBeDefined()
    })
  })
})
