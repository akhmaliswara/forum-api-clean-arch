const NewComment = require('../../Domains/comments/entities/NewComment');

class CommentUseCase {
  constructor({ commentRepository, threadRepository, userRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
  }

  async addComment(useCasePayload, username) {
    const id = await this._userRepository.getIdByUsername(username);
    await this._threadRepository.verifyAvailableThreadId(useCasePayload.threadId);

    const newComment = new NewComment({ ...useCasePayload, owner: id })
    return await this._commentRepository.addComment(newComment);
  }

  async deleteComment(useCasePayload, username) {
    await this._threadRepository.verifyAvailableThreadId(useCasePayload.threadId);
    await this._commentRepository.verifyAvailableCommentId(useCasePayload.commentId);

    const id = await this._userRepository.getIdByUsername(username);
    const comment = await this._commentRepository.getById(useCasePayload.commentId);

    if (comment.owner !== id) {
      throw new Error('DELETE_COMMENT.UNAUTHORIZED');
    }

    return await this._commentRepository.deleteComment(useCasePayload.commentId);
  }
}

module.exports = CommentUseCase;
