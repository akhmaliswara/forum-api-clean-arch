const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const NewThread = require('../../Domains/threads/entities/NewThread');

class ThreadUseCase {
  constructor({ replyRepository, commentRepository, threadRepository, userRepository }) {
    this._replyRepository = replyRepository;
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
    
    const replies = await this._replyRepository.getByThreadId(threadId);
    const comments = (await this._commentRepository.getByThreadId(threadId)).map((q) => ({
      id: q.id,
      username: q.username,
      date: q.date,
      content: q.is_deleted ? "**komentar telah dihapus**" : q.content,
      replies: replies.filter(p => p.comment_id === q.id).map(r => ({
        id: r.id,
        username: r.username,
        date: r.date,
        content: r.is_deleted ? "**balasan telah dihapus**" : r.content
      }))
    }));

    thread.comments = comments;
    return thread;
  }
}

module.exports = ThreadUseCase;
