const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NewComment = require('../../Domains/comments/entities/NewComment');

class CommentUseCase {
  constructor({ commentRepository, threadRepository, userRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
  }

  async addComment(useCasePayload, username) {
    const id = await this._userRepository.getIdByUsername(username);

    try {
      await this._threadRepository.getById(useCasePayload.threadId);
    } catch (error) {
      throw new NotFoundError(error.message);
    }

    const newComment = new NewComment({ ...useCasePayload, owner: id })
    return await this._commentRepository.addComment(newComment);
  }

  async deleteComment(useCasePayload, username) {
    const id = await this._userRepository.getIdByUsername(username);
    let comment;

    try {
      await this._threadRepository.getById(useCasePayload.threadId);
      comment = await this._commentRepository.getById(useCasePayload.commentId);
    } catch (error) {
      throw new NotFoundError(error.message);
    }

    if (comment.owner !== id) {
      throw new AuthorizationError("Unauthorized");
    }

    return await this._commentRepository.deleteComment(useCasePayload.commentId);
  }
}

module.exports = CommentUseCase;
