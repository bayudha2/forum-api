const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const UserRepository = require('../../../Domains/users/UserRepository');
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');

describe('GetDetailThreadUseCase', () => {
  it('should orchestrating the get detail thread action correctly', async () => {
    // Arrange
    const ids = {
      thread_id: 'thread-999',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockUserRepository = new UserRepository();

    // Mocking
    // Thread
    mockThreadRepository.checkThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockUserRepository.getUsernameByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.insertUsernameOnThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    // Comment
    mockCommentRepository.getCommentbyThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.getTotalLike = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockUserRepository.getUsernameByThreadIdFromComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    // Replies
    mockReplyRepository.getReplyByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockUserRepository.getUsernameByThreadIdFromReplies = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.insertReplyToComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    // use case instance
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      userRepository: mockUserRepository,
    });

    // Action
    await getDetailThreadUseCase.execute(ids.thread_id);
  });
});
