const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const NewThread = require('../../Domains/threads/entities/NewThread');

class ThreadUseCase {
  constructor({ commentRepository, threadRepository, userRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
  }

  async addThread(useCasePayload, username) {
    const id = await this._userRepository.getIdByUsername(username);
    const newThread = new NewThread({ ...useCasePayload, owner: id })
    return await this._threadRepository.addThread(newThread);
  }

  async getById(threadId) {
    let thread;

    try {
      thread = await this._threadRepository.getById(threadId);
    } catch (error) {
      throw new NotFoundError('thread not found');
    }

    const comments = (await this._commentRepository.getByThreadId(threadId)).map((q) => ({
      id: q.id,
      username: q.username,
      date: q.date,
      content: q.is_deleted ? "**komentar telah dihapus**" : q.content
    }));

    thread.comments = comments;
    return thread;
  }
}

module.exports = ThreadUseCase;
