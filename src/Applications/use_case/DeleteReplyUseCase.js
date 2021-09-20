class DeleteReplyUseCase {
  constructor({ commentRepository, threadRepository, replyRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._replyRepository = replyRepository;
  }

  async execute(ids) {
    await this._threadRepository.checkThread(ids.thread_id);
    await this._commentRepository.checkComment(ids.comment_id);
    await this._replyRepository.checkReply(ids.reply_id);
    await this._replyRepository.verifyOwner(ids.credentialId, ids.reply_id);
    await this._replyRepository.deleteReply(ids.reply_id);
  }
}

module.exports = DeleteReplyUseCase;
