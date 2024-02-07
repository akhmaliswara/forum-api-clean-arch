const NewThread = require('../../Domains/threads/entities/NewThread');

class ThreadUseCase {
  constructor({ threadRepository, userRepository }) {
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
  }

  async addThread(useCasePayload, username) {
    const id = await this._userRepository.getIdByUsername(username);
    const newThread = new NewThread({ ...useCasePayload, owner: id })
    return await this._threadRepository.addThread(newThread);
  }
}

module.exports = ThreadUseCase;
