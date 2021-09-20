const NewThread = require('../../Domains/threads/entities/NewThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  execute(useCasePayload, credentialId) {
    const newThread = new NewThread(useCasePayload);
    const accessId = credentialId;
    return this._threadRepository.addThread(newThread, accessId);
  }
}

module.exports = AddThreadUseCase;
