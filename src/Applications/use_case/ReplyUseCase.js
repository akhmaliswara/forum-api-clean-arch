const NewReply = require('../../Domains/replies/entities/NewReply')

class ReplyUseCase {
  constructor ({ replyRepository, commentRepository, threadRepository, userRepository }) {
    this._replyRepository = replyRepository
    this._commentRepository = commentRepository
    this._threadRepository = threadRepository
    this._userRepository = userRepository
  }

  async addReply (useCasePayload, username) {
    const id = await this._userRepository.getIdByUsername(username)

    await this._threadRepository.verifyAvailableThreadId(useCasePayload.threadId)
    await this._commentRepository.verifyAvailableCommentId(useCasePayload.commentId)

    const newReply = new NewReply({ ...useCasePayload, owner: id })
    return await this._replyRepository.addReply(newReply)
  }

  async deleteReply (useCasePayload, username) {
    await this._threadRepository.verifyAvailableThreadId(useCasePayload.threadId)
    await this._commentRepository.verifyAvailableCommentId(useCasePayload.commentId)
    await this._replyRepository.verifyAvailableReplyId(useCasePayload.replyId)

    const id = await this._userRepository.getIdByUsername(username)
    const reply = await this._replyRepository.getById(useCasePayload.replyId)

    if (reply.owner !== id) {
      throw new Error('DELETE_REPLY.UNAUTHORIZED')
    }

    return await this._replyRepository.deleteReply(useCasePayload.replyId)
  }
}

module.exports = ReplyUseCase
