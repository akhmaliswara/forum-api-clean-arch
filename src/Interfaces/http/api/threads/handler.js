const ThreadUseCase = require('../../../../Applications/use_case/ThreadUseCase')

class ThreadsHandler {
  constructor (container) {
    this._container = container

    this.postThreadHandler = this.postThreadHandler.bind(this)
  }

  async postThreadHandler (request, h) {
    const threadUseCase = this._container.getInstance(ThreadUseCase.name)
    const { username } = request.auth.credentials

    const addedThread = await threadUseCase.addThread(request.payload, username)

    const response = h.response({
      status: 'success',
      data: {
        addedThread
      }
    })
    response.code(201)
    return response
  }

  async getByIdHandler (request, h) {
    const threadUseCase = this._container.getInstance(ThreadUseCase.name)
    const { threadId } = request.params

    const thread = await threadUseCase.getById(threadId)
    const response = h.response({
      status: 'success',
      data: {
        thread
      }
    })
    response.code(200)
    return response
  }
}

module.exports = ThreadsHandler
