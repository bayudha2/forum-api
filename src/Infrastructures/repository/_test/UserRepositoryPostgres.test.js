const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const UserRepository = require('../../../Domains/users/UserRepository');
const NewUser = require('../../../Domains/users/entities/NewUser');
const AddedUser = require('../../../Domains/users/entities/AddedUser');
const pool = require('../../database/postgres/pool');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');

describe('UserRepositoryPostgres', () => {
  it('should be instance of UserRepository domain', () => {
    const userRepositoryPostgres = new UserRepositoryPostgres({}, {}); // dummy dependency

    expect(userRepositoryPostgres).toBeInstanceOf(UserRepository);
  });

  describe('behavior test', () => {
    afterEach(async () => {
      await UsersTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
      await CommentsTableTestHelper.cleanTable();
      await RepliesTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await pool.end();
    });

    describe('verifyAvailableUsername function', () => {
      it('should throw InvariantError when username not available', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({ username: 'dicoding' }); // memasukan user baru dengan username dicoding
        const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

        // Action & Assert
        await expect(
          userRepositoryPostgres.verifyAvailableUsername('dicoding')
        ).rejects.toThrowError(InvariantError);
      });

      it('should not throw InvariantError when username available', async () => {
        // Arrange
        const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

        // Action & Assert
        await expect(
          userRepositoryPostgres.verifyAvailableUsername('dicoding')
        ).resolves.not.toThrowError(InvariantError);
      });
    });

    describe('addUser function', () => {
      it('should persist new user and return added user correctly', async () => {
        // Arrange
        const newUser = new NewUser({
          username: 'dicoding',
          password: 'secret_password',
          fullname: 'Dicoding Indonesia',
        });
        const fakeIdGenerator = () => '123'; // stub!
        const userRepositoryPostgres = new UserRepositoryPostgres(
          pool,
          fakeIdGenerator
        );

        // Action
        const addedUser = await userRepositoryPostgres.addUser(newUser);

        // Assert
        const users = await UsersTableTestHelper.findUsersById('user-123');
        expect(addedUser).toStrictEqual(
          new AddedUser({
            id: 'user-123',
            username: 'dicoding',
            fullname: 'Dicoding Indonesia',
          })
        );
        expect(users).toHaveLength(1);
      });
    });

    describe('getPasswordByUsername', () => {
      it('should throw InvariantError when user not found', () => {
        // Arrange
        const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

        // Action & Assert
        return expect(
          userRepositoryPostgres.getPasswordByUsername('dicoding')
        ).rejects.toThrowError(InvariantError);
      });

      it('should return username password when user is found', async () => {
        // Arrange
        const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});
        await UsersTableTestHelper.addUser({
          username: 'dicoding',
          password: 'secret_password',
        });

        // Action & Assert
        const password = await userRepositoryPostgres.getPasswordByUsername(
          'dicoding'
        );
        expect(password).toBe('secret_password');
      });
    });

    describe('getUsernameByThreadId', () => {
      it('should return username correctly', async () => {
        // Arrange
        const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});
        await UsersTableTestHelper.addUser({
          id: 'user-222',
          username: 'dicoding2',
        });
        await ThreadsTableTestHelper.addThread({
          id: 'thread-123',
          owner: 'user-222',
        });

        // Action
        const resultUsername =
          await userRepositoryPostgres.getUsernameByThreadId('thread-123');

        // Assert
        expect(resultUsername[0]).toHaveProperty('id');
        expect(resultUsername[0]).toHaveProperty('username');
      });
    });

    describe('getUsernameByThreadIdFromComment function', () => {
      it('should return username correctly', async () => {
        const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});
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

        // Action
        const resultUsername =
          await userRepositoryPostgres.getUsernameByThreadIdFromComment(
            'thread-123'
          );

        // Assert
        expect(resultUsername[0]).toHaveProperty('id');
        expect(resultUsername[0]).toHaveProperty('username');
      });
    });

    describe('getUsernameByThreadIdFromReplies function', () => {
      it('should return username correctly', async () => {
        const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});
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
        const resultUsername =
          await userRepositoryPostgres.getUsernameByThreadIdFromReplies(
            'thread-123'
          );

        // Assert
        expect(resultUsername[0]).toHaveProperty('id');
        expect(resultUsername[0]).toHaveProperty('username');
      });
    });

    describe('getIdByUsername', () => {
      it('should throw InvariantError when user not found', async () => {
        // Arrange
        const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

        // Action & Assert
        await expect(
          userRepositoryPostgres.getIdByUsername('dicoding')
        ).rejects.toThrowError(InvariantError);
      });

      it('should return user id correctly', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({
          id: 'user-321',
          username: 'dicoding',
        });
        const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

        // Action
        const userId = await userRepositoryPostgres.getIdByUsername('dicoding');

        // Assert
        expect(userId).toEqual('user-321');
      });
    });
  });
});
