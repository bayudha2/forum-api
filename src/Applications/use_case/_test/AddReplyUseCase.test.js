const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const AddReplyUseCase = require('../AddReplyUseCase');
const NewReply = require('../../../Domains/replies/entities/NewReply');

describe('AddReplyUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'sebuah balasan',
    };

    const ids = {
      thread_id: 'thread-123',
      comment_id: 'comment-123',
      credentialId: 'user-123',
    };

    const expectedAddedReply = new AddedReply({
      id: 'comment-123',
      content: 'sebuah balasan',
      owner: 'user-123',
    });

    // depedency
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockReplyRepository = new ReplyRepository();

    // Mocking
    mockThreadRepository.checkThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.addReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedAddedReply));

    // use case instance
    const addReplyUseCase = new AddReplyUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const addedReply = await addReplyUseCase.execute(useCasePayload, ids);

    // Assert
    expect(addedReply).toStrictEqual(expectedAddedReply);
    expect(mockThreadRepository.checkThread).toBeCalledWith(ids.thread_id);
    expect(mockCommentRepository.checkComment).toBeCalledWith(ids.comment_id);
    expect(mockReplyRepository.addReply).toBeCalledWith(
      new NewReply({
        content: useCasePayload.content,
      }),
      ids
    );
  });
});
