const DetailComment = require('../../Domains/comments/entities/DetailComment');
const DetailReply = require('../../Domains/replies/entities/DetailReply');

class GetDetailThreadUseCase {
  constructor({
    userRepository,
    threadRepository,
    commentRepository,
    replyRepository,
  }) {
    this._userRepository = userRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(ids) {
    await this._threadRepository.checkThread(ids.thread_id);
    const threads = await this._threadRepository.getThreadById(ids.thread_id);
    const threadUsername = await this._userRepository.getUsernameByThreadId(
      ids.thread_id
    );
    const threadResult = await this._threadRepository.insertUsernameOnThread(
      threads,
      threadUsername
    );

    /* Comments */
    const comments = await this._commentRepository.getCommentbyThreadId(
      ids.thread_id
    );

    const totalLike = await this._commentRepository.getTotalLike(ids.thread_id);

    if (comments === undefined) {
      return [];
    }

    const detailComment = new DetailComment();
    await detailComment._checkDeleteComment(comments);
    const detailedComment = await detailComment._sortDate(comments);
    await detailComment._insertCountLike(comments, totalLike);
    const commentUsername =
      await this._userRepository.getUsernameByThreadIdFromComment(
        ids.thread_id
      );

    const resultComment = await detailComment._insertUsernameOnComment(
      detailedComment,
      commentUsername
    );

    /* Replies */
    const replies = await this._replyRepository.getReplyByThreadId(
      ids.thread_id
    );

    const detailReply = new DetailReply();
    await detailReply._checkDeleteReply(replies);
    const detailedReply = await detailReply._sortDate(replies);

    const repliesUsername =
      await this._userRepository.getUsernameByThreadIdFromReplies(
        ids.thread_id
      );
    const resultReply = await detailReply._insertUsernameOnReply(
      detailedReply,
      repliesUsername
    );

    /* Final comment */
    const finalComment = await detailComment._insertReplyToComment(
      resultComment,
      resultReply
    );

    const detailThread = {
      ...threadResult,
      comments: finalComment,
    };

    return detailThread;
  }
}

module.exports = GetDetailThreadUseCase;
