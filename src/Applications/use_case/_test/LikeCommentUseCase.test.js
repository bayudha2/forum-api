const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const UserRepository = require('../../../Domains/users/UserRepository');
const LikeCommentUseCase = require('../LikeCommentUseCase');

describe('LikeCommentUseCase', () => {
  it('should orchestrating like comment action correctly', async () => {
    // Arrange
    const ids = {
      thread_id: 'thread-123',
      comment_id: 'comment-123',
      credentialId: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockUserRepository = new UserRepository();

    // Mocking
    mockThreadRepository.checkThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkCommentLike = jest
      .fn()
      .mockImplementation(() => Promise.resolve([]));
    mockCommentRepository.likeComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.unlikeComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    // Instance
    const likeCommentUseCase = new LikeCommentUseCase({
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });
    // Action
    await likeCommentUseCase.execute(ids);

    // Assert
    expect(mockThreadRepository.checkThread).toBeCalledWith(ids.thread_id);
    expect(mockCommentRepository.checkComment).toBeCalledWith(ids.comment_id);
    expect(mockCommentRepository.checkCommentLike).toBeCalledWith(ids);
  });

  it('should orchestrating unlike comment action correctly', async () => {
    // Arrange
    const ids = {
      thread_id: 'thread-123',
      comment_id: 'comment-123',
      credentialId: 'user-123',
    };
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockUserRepository = new UserRepository();

    // Mocking
    mockThreadRepository.checkThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkCommentLike = jest
      .fn()
      .mockImplementation(() => Promise.resolve(['userlike']));
    mockCommentRepository.likeComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.unlikeComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    // Instance
    const likeCommentUseCase = new LikeCommentUseCase({
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });
    // Action
    await likeCommentUseCase.execute(ids);

    // Assert
    expect(mockThreadRepository.checkThread).toBeCalledWith(ids.thread_id);
    expect(mockCommentRepository.checkComment).toBeCalledWith(ids.comment_id);
    expect(mockCommentRepository.checkCommentLike).toBeCalledWith(ids);
  });
});
