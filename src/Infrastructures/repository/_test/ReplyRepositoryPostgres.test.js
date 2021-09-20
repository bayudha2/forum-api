const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const CommentsTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const pool = require('../../database/postgres/pool');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ReplyRepositoryPostgres', () => {
  it('should be instance of ReplyRepository domain', () => {
    const replyRepository = new ReplyRepositoryPostgres({}, {});

    expect(replyRepository).toBeInstanceOf(ReplyRepository);
  });
});

describe('behavior test', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should add new reply and return added reply correctly', async () => {
      // Arrange
      const newReply = new NewReply({
        content: 'sebuah balasan',
      });
      const ids = {
        thread_id: 'thread-123',
        comment_id: 'comment-123',
        credentialId: 'user-333',
      };
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding1',
      });
      await UsersTableTestHelper.addUser({
        id: 'user-222',
        username: 'dicoding2',
      });
      await UsersTableTestHelper.addUser({
        id: 'user-333',
        username: 'dicoding3',
      });
      await ThreadsTableTestHelper.addThread({ id: ids.thread_id });
      await CommentsTableTestHelper.addComment({
        id: ids.comment_id,
        credentialId: 'user-222',
        thread_id: 'thread-123',
      });
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(newReply, ids);

      // Assert
      const replies = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(addedReply).toStrictEqual(
        new AddedReply({
          id: 'reply-123',
          content: 'sebuah balasan',
          owner: 'user-333',
        })
      );
      expect(replies).toHaveLength(1);
    });

    describe('verifyOwner function', () => {
      it("should throw AuthorizationError if user doesn't have permission", async () => {
        // Arrange
        await UsersTableTestHelper.addUser({ id: 'user-123' });
        await UsersTableTestHelper.addUser({
          id: 'user-222',
          username: 'dicoding2',
        });
        await UsersTableTestHelper.addUser({
          id: 'user-333',
          username: 'dicoding3',
        });
        await ThreadsTableTestHelper.addThread({
          id: 'thread-123',
          owner: 'user-123',
        });
        await CommentsTableTestHelper.addComment({
          credentialId: 'user-222',
        });
        await RepliesTableTestHelper.addReply({
          credentialId: 'user-333',
        });

        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

        // Action & Assert
        await expect(
          replyRepositoryPostgres.verifyOwner('user-222', 'reply-123')
        ).rejects.toThrowError(AuthorizationError);
      });

      it('should not throw AuthorizationError if user have permission', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({ id: 'user-123' });
        await UsersTableTestHelper.addUser({
          id: 'user-222',
          username: 'dicoding2',
        });
        await UsersTableTestHelper.addUser({
          id: 'user-333',
          username: 'dicoding3',
        });
        await ThreadsTableTestHelper.addThread({
          id: 'thread-123',
          owner: 'user-123',
        });
        await CommentsTableTestHelper.addComment({
          credentialId: 'user-222',
        });
        await RepliesTableTestHelper.addReply({
          credentialId: 'user-333',
        });

        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

        // Action & Assert
        await expect(
          replyRepositoryPostgres.verifyOwner('user-333', 'reply-123')
        ).resolves.not.toThrowError(AuthorizationError);
      });
    });

    describe('checkReplyById', () => {
      it('should throw NotFoundError when reply not found', () => {
        // Arrange
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

        // ACtion & Assert
        return expect(
          replyRepositoryPostgres.checkReply('reply-123')
        ).rejects.toThrowError(NotFoundError);
      });

      it('should not throw NotFoundError when reply available', async () => {
        // Arrange
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
        await UsersTableTestHelper.addUser({ id: 'user-123' });
        await UsersTableTestHelper.addUser({
          id: 'user-222',
          username: 'dicoding2',
        });
        await UsersTableTestHelper.addUser({
          id: 'user-333',
          username: 'dicoding3',
        });
        await ThreadsTableTestHelper.addThread({
          id: 'thread-123',
          owner: 'user-123',
        });
        await CommentsTableTestHelper.addComment({
          credentialId: 'user-222',
        });
        await RepliesTableTestHelper.addReply({
          credentialId: 'user-333',
        });

        // Arrange & Assert
        return expect(
          replyRepositoryPostgres.checkReply('reply-123')
        ).resolves.not.toThrowError(NotFoundError);
      });
    });

    describe('getReplyByThreadId', () => {
      it('should return reply correctly', async () => {
        // Arrange
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
        await UsersTableTestHelper.addUser({ id: 'user-123' });
        await UsersTableTestHelper.addUser({
          id: 'user-222',
          username: 'dicoding2',
        });
        await UsersTableTestHelper.addUser({
          id: 'user-333',
          username: 'dicoding3',
        });
        await ThreadsTableTestHelper.addThread({
          id: 'thread-123',
          owner: 'user-123',
        });
        await CommentsTableTestHelper.addComment({
          credentialId: 'user-222',
        });
        await CommentsTableTestHelper.addComment({
          id: 'comment-333',
          credentialId: 'user-333',
        });
        await RepliesTableTestHelper.addReply({
          id: 'reply-111',
          credentialId: 'user-333',
        });
        await RepliesTableTestHelper.addReply({
          id: 'reply-222',
          credentialId: 'user-222',
        });
        await RepliesTableTestHelper.addReply({
          id: 'reply-333',
          comment_id: 'comment-333',
          credentialId: 'user-222',
        });

        // Action
        const replyResult = await replyRepositoryPostgres.getReplyByThreadId(
          'thread-123'
        );

        // Assert
        expect(replyResult[0]).toHaveProperty('id');
        expect(replyResult[0]).toHaveProperty('content');
        expect(replyResult[0]).toHaveProperty('date');
        expect(replyResult[0]).toHaveProperty('comment_id');
        expect(replyResult[0]).toHaveProperty('is_delete');
      });
    });

    describe('deleteReply', () => {
      it('should change is_delete reply from database', async () => {
        // Arrange
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
        await UsersTableTestHelper.addUser({ id: 'user-123' });
        await UsersTableTestHelper.addUser({
          id: 'user-222',
          username: 'dicoding2',
        });
        await UsersTableTestHelper.addUser({
          id: 'user-333',
          username: 'dicoding3',
        });
        await ThreadsTableTestHelper.addThread({
          id: 'thread-123',
          owner: 'user-123',
        });
        await CommentsTableTestHelper.addComment({
          credentialId: 'user-222',
        });
        await RepliesTableTestHelper.addReply({
          credentialId: 'user-333',
        });

        // Action
        await replyRepositoryPostgres.deleteReply('reply-123');

        // Assert
        const is_delete = await RepliesTableTestHelper.checkIs_delete(
          'reply-123'
        );
        expect(is_delete).toStrictEqual({ is_delete: true });
      });
    });
  });
});
