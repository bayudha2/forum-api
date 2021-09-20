const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'sebuah thread',
      body: 'sebuah body thread',
    };
    const credentialId = 'user-123';

    const expectedAddedThread = new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: 'id-123',
    });

    // depedency
    const mockThreadRepository = new ThreadRepository();

    // mocking
    mockThreadRepository.addThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedAddedThread));

    // use case instance
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // action
    const addThread = await addThreadUseCase.execute(
      useCasePayload,
      credentialId
    );

    // assert
    expect(addThread).toStrictEqual(expectedAddedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(
      new NewThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
      }),
      credentialId
    );
  });
});
