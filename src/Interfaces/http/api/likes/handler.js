const LikeUseCase = require('../../../../Applications/use_case/LikeUseCase')

class LikesHandler {
  constructor (container) {
    this._container = container

    this.putLikeHandler = this.putLikeHandler.bind(this)
  }

  async putLikeHandler (request, h) {
    const likeUseCase = this._container.getInstance(LikeUseCase.name)
    const { threadId, commentId } = request.params
    const { username } = request.auth.credentials

    await likeUseCase.likeOrUnlike({ threadId, commentId }, username)

    const response = h.response({
      status: 'success'
    })
    response.code(200)
    return response
  }
}

module.exports = LikesHandler
