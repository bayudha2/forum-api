class LikeCommentUseCase {
  constructor({ userRepository, threadRepository, commentRepository }) {
    this._userRepository = userRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(ids) {
    await this._threadRepository.checkThread(ids.thread_id);
    await this._commentRepository.checkComment(ids.comment_id);
    const userlike = await this._commentRepository.checkCommentLike(ids);
    const length = Object.keys(userlike).length;
    if (length > 0) {
      await this._commentRepository.unlikeComment(ids);
    } else {
      await this._commentRepository.likeComment(ids);
    }
  }
}

module.exports = LikeCommentUseCase;
