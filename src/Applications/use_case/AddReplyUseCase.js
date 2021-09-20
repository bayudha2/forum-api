const NewReply = require('../../Domains/replies/entities/NewReply');

class AddReplyUseCase {
  constructor({ commentRepository, threadRepository, replyRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload, ids) {
    const newReply = new NewReply(useCasePayload);
    await this._threadRepository.checkThread(ids.thread_id);
    await this._commentRepository.checkComment(ids.comment_id);
    return this._replyRepository.addReply(newReply, ids);
  }
}

module.exports = AddReplyUseCase;
