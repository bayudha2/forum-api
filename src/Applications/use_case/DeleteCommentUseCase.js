class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(ids) {
    await this._threadRepository.checkThread(ids.thread_id);
    await this._commentRepository.checkComment(ids.comment_id);
    await this._commentRepository.verifyOwner(ids.credentialId, ids.comment_id);
    await this._commentRepository.deleteComment(ids.comment_id);
  }
}

module.exports = DeleteCommentUseCase;
