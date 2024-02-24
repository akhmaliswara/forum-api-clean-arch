const CommentUseCase = require('../../../../Applications/use_case/CommentUseCase')

class CommentsHandler {
  constructor (container) {
    this._container = container

    this.postCommentHandler = this.postCommentHandler.bind(this)
  }

  async postCommentHandler (request, h) {
    const commentUseCase = this._container.getInstance(CommentUseCase.name)
    const { threadId } = request.params
    const { username } = request.auth.credentials

    const addedComment = await commentUseCase.addComment({ ...request.payload, threadId }, username)

    const response = h.response({
      status: 'success',
      data: {
        addedComment
      }
    })
    response.code(201)
    return response
  }

  async deleteCommentHandler (request, h) {
    const commentUseCase = this._container.getInstance(CommentUseCase.name)
    const { threadId, commentId } = request.params
    const { username } = request.auth.credentials

    await commentUseCase.deleteComment({ commentId, threadId }, username)

    const response = h.response({
      status: 'success'
    })
    response.code(200)
    return response
  }
}

module.exports = CommentsHandler
