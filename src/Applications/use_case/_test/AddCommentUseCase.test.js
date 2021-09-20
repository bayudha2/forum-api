const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');
const NewComment = require('../../../Domains/comments/entities/NewComment');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'sebuah comment',
    };

    const ids = {
      thread_id: 'thread-123',
      credentialId: 'user-123',
    };

    const expectedAddedComment = new AddedComment({
      id: 'comment-123',
      content: 'sebuah comment',
      owner: 'user-123',
    });

    // depedency
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    // Mocking
    mockThreadRepository.checkThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedAddedComment));

    // use case instance
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(useCasePayload, ids);

    // Assert
    expect(addedComment).toStrictEqual(expectedAddedComment);
    expect(mockThreadRepository.checkThread).toBeCalledWith(ids.thread_id);
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new NewComment({
        content: useCasePayload.content,
      }),
      ids
    );
  });
});
