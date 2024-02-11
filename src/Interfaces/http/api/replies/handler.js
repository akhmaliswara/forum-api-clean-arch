const ReplyUseCase = require('../../../../Applications/use_case/ReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const replyUseCase = this._container.getInstance(ReplyUseCase.name);
    const { threadId, commentId } = request.params;
    const { username } = request.auth.credentials;

    const addedReply = await replyUseCase.addReply({ ...request.payload, threadId, commentId }, username);

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyHandler(request, h) {
    const replyUseCase = this._container.getInstance(ReplyUseCase.name);
    const { threadId, commentId, replyId } = request.params;
    const { username } = request.auth.credentials;

    await replyUseCase.deleteReply({ replyId, commentId, threadId }, username);

    const response = h.response({
      status: 'success'
    });
    response.code(200);
    return response;
  }
}

module.exports = RepliesHandler;
