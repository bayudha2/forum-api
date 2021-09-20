const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  it('should be instance of ThreadRepository domain', () => {
    const threadRepositoryPostgres = new ThreadRepositoryPostgres({}, {});

    expect(threadRepositoryPostgres).toBeInstanceOf(ThreadRepository);
  });

  describe('behavior test', () => {
    afterEach(async () => {
      await ThreadsTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
      await CommentsTableTestHelper.cleanTable();
      await RepliesTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await pool.end();
    });

    describe('checkThreadByThreadId', () => {
      it('should throw NotFoundError when thread not found', () => {
        // Arrange
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

        // Action & Assert
        return expect(
          threadRepositoryPostgres.checkThread('thread-123')
        ).rejects.toThrowError(NotFoundError);
      });

      it('should not throw NotFoundError when thread available', async () => {
        // Arrange
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
        await UsersTableTestHelper.addUser({ id: 'user-123' });
        await ThreadsTableTestHelper.addThread({
          id: 'thread-123',
          title: 'sebuah thread',
          body: 'body thread',
        });

        // Action & Assert
        await expect(
          threadRepositoryPostgres.checkThread('thread-123')
        ).resolves.not.toThrowError(NotFoundError);
      });
    });

    describe('addThread function', () => {
      it('should add new thread and return added thread correctly', async () => {
        // Arrange
        const newThread = new NewThread({
          title: 'sebuah thread',
          body: 'body thread',
        });
        await UsersTableTestHelper.addUser({ id: 'user-123' });
        const credentialId = 'user-123';
        const fakeIdGenerator = () => '123';
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(
          pool,
          fakeIdGenerator
        );
        // Action
        const addedThread = await threadRepositoryPostgres.addThread(
          newThread,
          credentialId
        );
        // Assert
        const threads = await ThreadsTableTestHelper.findThreadsById(
          'thread-123'
        );
        expect(addedThread).toStrictEqual(
          new AddedThread({
            id: 'thread-123',
            title: 'sebuah thread',
            owner: 'user-123',
          })
        );
        expect(threads).toHaveLength(1);
      });
    });

    describe('getThreadById', () => {
      it('should return thread correctly', async () => {
        // Arrange
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
        await UsersTableTestHelper.addUser({
          id: 'user-222',
          username: 'dicoding2',
        });
        await ThreadsTableTestHelper.addThread({
          id: 'thread-123',
          owner: 'user-222',
        });

        // Action
        const resultThread = await threadRepositoryPostgres.getThreadById(
          'thread-123'
        );

        // Assert
        expect(resultThread[0]).toHaveProperty('id');
        expect(resultThread[0]).toHaveProperty('title');
        expect(resultThread[0]).toHaveProperty('body');
        expect(resultThread[0]).toHaveProperty('date');
        expect(resultThread[0]).toHaveProperty('owner');
      });
    });

    describe('insertUsernameOnThread function', () => {
      it('should add username property and remove owner property', async () => {
        // Arrange
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
        const threadpayload = [
          {
            id: 'thread-333',
            title: 'sebuah thread',
            body: 'body thread',
            date: '2021-08-08T07:19:09.775Z',
            owner: 'user-222',
          },
        ];
        const threadUsernamePayload = [
          { id: 'user-222', username: 'dicoodingg' },
        ];

        // Action
        const threadResult =
          await threadRepositoryPostgres.insertUsernameOnThread(
            threadpayload,
            threadUsernamePayload
          );
        // Assert
        expect(threadResult).toHaveProperty('username');
      });

      it('should not add username property and remove owner property', async () => {
        // Arrange
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
        const threadpayload = [
          {
            id: 'thread-333',
            title: 'sebuah thread',
            body: 'body thread',
            date: '2021-08-08T07:19:09.775Z',
            owner: 'user-222',
          },
        ];
        const threadUsernamePayload = [
          { id: 'user-333', username: 'dicoodingg' },
        ];

        // Action
        const threadResult =
          await threadRepositoryPostgres.insertUsernameOnThread(
            threadpayload,
            threadUsernamePayload
          );
        // Assert
        expect(threadResult).toHaveProperty('owner');
      });
    });
  });
});
