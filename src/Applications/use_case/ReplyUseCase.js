const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NewReply = require('../../Domains/replies/entities/NewReply');

class ReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository, userRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
  }

  async addReply(useCasePayload, username) {
    const id = await this._userRepository.getIdByUsername(username);

    try {
      await this._threadRepository.getById(useCasePayload.threadId);
      await this._commentRepository.getById(useCasePayload.commentId);
    } catch (error) {
      throw new NotFoundError(error.message);
    }

    const newReply = new NewReply({ ...useCasePayload, owner: id })
    return await this._replyRepository.addReply(newReply);
  }

  async deleteReply(useCasePayload, username) {
    const id = await this._userRepository.getIdByUsername(username);
    let reply;

    try {
      await this._threadRepository.getById(useCasePayload.threadId);
      await this._commentRepository.getById(useCasePayload.commentId);
      reply = await this._replyRepository.getById(useCasePayload.replyId);
    } catch (error) {
      throw new NotFoundError(error.message);
    }

    if (reply.owner !== id) {
      throw new AuthorizationError("Unauthorized");
    }

    return await this._replyRepository.deleteReply(useCasePayload.replyId);
  }
}

module.exports = ReplyUseCase;
