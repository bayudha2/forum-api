const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const ids = {
      thread_id: 'thread-123',
      comment_id: 'comment-123',
      credentialId: 'user-123',
    };
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // Mocking
    mockThreadRepository.checkThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    // Instance
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await deleteCommentUseCase.execute(ids);

    // Assert
    expect(mockThreadRepository.checkThread).toBeCalledWith(ids.thread_id);
    expect(mockCommentRepository.checkComment).toBeCalledWith(ids.comment_id);
    expect(mockCommentRepository.verifyOwner).toBeCalledWith(
      ids.credentialId,
      ids.comment_id
    );
    expect(mockCommentRepository.deleteComment).toBeCalledWith(ids.comment_id);
  });
});
