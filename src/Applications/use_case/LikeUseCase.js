const NewLike = require('../../Domains/likes/entities/NewLike');

class LikeUseCase {
  constructor({ likeRepository, commentRepository, threadRepository, userRepository }) {
    this._likeRepository = likeRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
  }

  async likeOrUnlike(useCasePayload, username) {
    const id = await this._userRepository.getIdByUsername(username);

    await this._threadRepository.verifyAvailableThreadId(useCasePayload.threadId);
    await this._commentRepository.verifyAvailableCommentId(useCasePayload.commentId);

    const existLike = await this._likeRepository.getByCommentAndOwner(useCasePayload.commentId, id)
    if (existLike) {
      return await this._likeRepository.deleteLike(existLike.id);
    } else {
      const newLike = new NewLike({ ...useCasePayload, owner: id })
      return await this._likeRepository.addLike(newLike);
    }
  }
}

module.exports = LikeUseCase;
