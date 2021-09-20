const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, ids) {
    const newComment = new NewComment(useCasePayload);
    await this._threadRepository.checkThread(ids.thread_id);
    return this._commentRepository.addComment(newComment, ids);
  }
}

module.exports = AddCommentUseCase;
