const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const ids = {
      thread_id: 'thread-123',
      comment_id: 'comment-123',
      reply_id: 'reply-123',
      credentialId: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    // Mocking
    mockThreadRepository.checkThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.checkReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    // Instance
    const deleteReplytUseCase = new DeleteReplyUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    await deleteReplytUseCase.execute(ids);

    // Assert
    expect(mockThreadRepository.checkThread).toBeCalledWith(ids.thread_id);
    expect(mockCommentRepository.checkComment).toBeCalledWith(ids.comment_id);
    expect(mockReplyRepository.checkReply).toBeCalledWith(ids.reply_id);
    expect(mockReplyRepository.verifyOwner).toBeCalledWith(
      ids.credentialId,
      ids.reply_id
    );
    expect(mockReplyRepository.deleteReply).toBeCalledWith(ids.reply_id);
  });
});
