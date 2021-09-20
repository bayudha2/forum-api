const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentsTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const LikeTableTestHelper = require('../../../../tests/LikeTableTestHelper');
const pool = require('../../database/postgres/pool');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('CommentRepositoryPostgres', () => {
  it('should be instance of CommentRepository domain', () => {
    const commentRepository = new CommentRepositoryPostgres({}, {});

    expect(commentRepository).toBeInstanceOf(CommentRepository);
  });
});

describe('behavior test', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await LikeTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should add new comment and return added comment correctly', async () => {
      // Arrange
      const newComment = new NewComment({
        content: 'sebuah comment',
      });
      const ids = {
        credentialId: 'user-222',
        thread_id: 'thread-123',
      };
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding1',
      });
      await UsersTableTestHelper.addUser({
        id: 'user-222',
        username: 'dicoding2',
      });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(
        newComment,
        ids
      );

      // Assert
      const comments = await CommentsTableTestHelper.findCommentById(
        'comment-123'
      );
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: 'comment-123',
          content: 'sebuah comment',
          owner: 'user-222',
        })
      );
      expect(comments).toHaveLength(1);
    });

    describe('verifyOwner function', () => {
      it("should throw AuthorizationError if user doesn't have permission ", async () => {
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

        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          {}
        );

        // Action & Assert
        await expect(
          commentRepositoryPostgres.verifyOwner('user-333', 'comment-123')
        ).rejects.toThrowError(AuthorizationError);
      });

      it('should not throw AuthorizationError if user have permission ', async () => {
        // Arrange
        await UsersTableTestHelper.addUser({ id: 'user-123' });
        await UsersTableTestHelper.addUser({
          id: 'user-222',
          username: 'dicoding2',
        });
        await ThreadsTableTestHelper.addThread({
          id: 'thread-123',
          owner: 'user-123',
        });
        await CommentsTableTestHelper.addComment({
          credentialId: 'user-222',
        });

        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          {}
        );

        // Action & Assert
        await expect(
          commentRepositoryPostgres.verifyOwner('user-222', 'comment-123')
        ).resolves.not.toThrowError(AuthorizationError);
      });
    });

    describe('checkCommentById', () => {
      it('should throw NotFoundError when comment not found', () => {
        // Arrange
        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          {}
        );

        // Action & Assert
        return expect(
          commentRepositoryPostgres.checkComment('comment-123')
        ).rejects.toThrowError(NotFoundError);
      });

      it('should not throw NotFoundError when comment available', async () => {
        // Arrange
        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          {}
        );
        await UsersTableTestHelper.addUser({ id: 'user-123' });
        await UsersTableTestHelper.addUser({
          id: 'user-222',
          username: 'dicoding2',
        });
        await ThreadsTableTestHelper.addThread({
          id: 'thread-123',
          owner: 'user-123',
        });
        await CommentsTableTestHelper.addComment({
          credentialId: 'user-222',
        });

        // Arrange & Assert
        return expect(
          commentRepositoryPostgres.checkComment('comment-123')
        ).resolves.not.toThrowError(NotFoundError);
      });
    });

    describe('getCommentbyThreadId', () => {
      it('should return comment correctly', async () => {
        // Arrange
        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          {}
        );
        await UsersTableTestHelper.addUser({ id: 'user-123' });
        await UsersTableTestHelper.addUser({
          id: 'user-222',
          username: 'dicoding2',
        });
        await ThreadsTableTestHelper.addThread({
          id: 'thread-123',
          owner: 'user-123',
        });
        await CommentsTableTestHelper.addComment({
          credentialId: 'user-222',
        });
        await CommentsTableTestHelper.addComment({
          id: 'comment-111',
          credentialId: 'user-123',
        });

        // Action
        const commentResult =
          await commentRepositoryPostgres.getCommentbyThreadId('thread-123');

        // Assert
        expect(commentResult[0]).toHaveProperty('id');
        expect(commentResult[0]).toHaveProperty('content');
        expect(commentResult[0]).toHaveProperty('date');
        expect(commentResult[0]).toHaveProperty('owner');
        expect(commentResult[0]).toHaveProperty('is_delete');
      });
    });

    describe('getCommentIds', () => {
      it('should return comment correctly', async () => {
        // Arrange
        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          {}
        );
        await UsersTableTestHelper.addUser({ id: 'user-123' });
        await UsersTableTestHelper.addUser({
          id: 'user-222',
          username: 'dicoding2',
        });
        await ThreadsTableTestHelper.addThread({
          id: 'thread-123',
          owner: 'user-123',
        });
        await CommentsTableTestHelper.addComment({
          credentialId: 'user-222',
        });
        await CommentsTableTestHelper.addComment({
          id: 'comment-111',
          credentialId: 'user-123',
        });

        // Action
        const commentResult = await commentRepositoryPostgres.getCommentIds(
          'thread-123'
        );

        // Assert
        expect(commentResult[0]).toHaveProperty('id');
      });
    });

    describe('checkCommentLike function', () => {
      it('should check object like correctly', async () => {
        // Arrange
        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          {}
        );
        const ids = {
          comment_id: 'comment-123',
          credentialId: 'user-222',
        };

        await UsersTableTestHelper.addUser({ id: 'user-123' });
        await UsersTableTestHelper.addUser({
          id: 'user-222',
          username: 'dicoding2',
        });
        await ThreadsTableTestHelper.addThread({
          id: 'thread-123',
          owner: 'user-123',
        });
        await CommentsTableTestHelper.addComment({
          credentialId: 'user-222',
        });

        // Action
        const likeResult = await commentRepositoryPostgres.checkCommentLike(
          ids
        );

        // Assert
        expect(likeResult).toStrictEqual([]);
      });

      it('should check object like correctly', async () => {
        // Arrange
        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          {}
        );
        const ids = {
          comment_id: 'comment-123',
          credentialId: 'user-222',
        };

        await UsersTableTestHelper.addUser({ id: 'user-123' });
        await UsersTableTestHelper.addUser({
          id: 'user-222',
          username: 'dicoding2',
        });
        await ThreadsTableTestHelper.addThread({
          id: 'thread-123',
          owner: 'user-123',
        });
        await CommentsTableTestHelper.addComment({
          credentialId: 'user-222',
        });

        await LikeTableTestHelper.addLike({
          id: 'like-1',
          credentialId: 'user-222',
          comment_id: 'comment-123',
        });

        // Action
        const likeResult = await commentRepositoryPostgres.checkCommentLike(
          ids
        );

        // Assert
        expect(likeResult[0]).toHaveProperty('id');
        expect(likeResult[0]).toHaveProperty('comment_id');
        expect(likeResult[0]).toHaveProperty('owner');
      });
    });

    describe('likeComment function', () => {
      it('should like comment correctly', async () => {
        // Arrange
        const fakeIdGenerator = () => '123';
        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          fakeIdGenerator
        );
        const ids = {
          comment_id: 'comment-123',
          credentialId: 'user-222',
        };

        await UsersTableTestHelper.addUser({ id: 'user-123' });
        await UsersTableTestHelper.addUser({
          id: 'user-222',
          username: 'dicoding2',
        });
        await ThreadsTableTestHelper.addThread({
          id: 'thread-123',
          owner: 'user-123',
        });
        await CommentsTableTestHelper.addComment({
          credentialId: 'user-222',
        });

        // Action
        await commentRepositoryPostgres.likeComment(ids);

        // Assert
        const like = await LikeTableTestHelper.findLikeById('like-123');
        expect(like).toHaveLength(1);
      });
    });

    describe('UnlikeComment function', () => {
      it('should unlike comment correctly', async () => {
        // Arrange
        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          {}
        );
        const ids = {
          comment_id: 'comment-123',
          credentialId: 'user-222',
        };

        await UsersTableTestHelper.addUser({ id: 'user-123' });
        await UsersTableTestHelper.addUser({
          id: 'user-222',
          username: 'dicoding2',
        });
        await ThreadsTableTestHelper.addThread({
          id: 'thread-123',
          owner: 'user-123',
        });
        await CommentsTableTestHelper.addComment({
          credentialId: 'user-222',
        });
        await LikeTableTestHelper.addLike({
          id: 'like-1',
          credentialId: 'user-222',
          comment_id: 'comment-123',
        });

        // Action
        await commentRepositoryPostgres.unlikeComment(ids);

        // Assert
        const like = await LikeTableTestHelper.findLikeById('like-123');
        expect(like).toHaveLength(0);
      });
    });

    describe('getTotalLike function', () => {
      it('should get total like correctly', async () => {
        // Arrange
        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          {}
        );
        const ids = {
          thread_id: 'thread-123',
        };

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
          id: 'comment-222',
          credentialId: 'user-222',
        });
        await LikeTableTestHelper.addLike({
          id: 'like-1',
          credentialId: 'user-222',
          comment_id: 'comment-123',
        });
        await LikeTableTestHelper.addLike({
          id: 'like-2',
          credentialId: 'user-222',
          comment_id: 'comment-123',
        });
        await LikeTableTestHelper.addLike({
          id: 'like-3',
          credentialId: 'user-333',
          comment_id: 'comment-222',
        });

        // Action
        const totalLike = await commentRepositoryPostgres.getTotalLike(
          ids.thread_id
        );

        // Assert
        expect(totalLike[0]).toHaveProperty('id');
        expect(totalLike[0]).toHaveProperty('comment_id');
      });
    });

    describe('deleteComment', () => {
      it('should change is_delete comment from database', async () => {
        // Arrange
        const comment_id = 'comment-123';
        const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool,
          {}
        );
        await UsersTableTestHelper.addUser({ id: 'user-123' });
        await UsersTableTestHelper.addUser({
          id: 'user-222',
          username: 'dicoding2',
        });
        await ThreadsTableTestHelper.addThread({
          id: 'thread-123',
          owner: 'user-123',
        });
        await CommentsTableTestHelper.addComment({
          credentialId: 'user-222',
        });

        // Action
        await commentRepositoryPostgres.deleteComment(comment_id);

        // Assert
        const is_delete = await CommentsTableTestHelper.checkIs_delete(
          comment_id
        );
        expect(is_delete).toStrictEqual({ is_delete: true });
      });
    });
  });
});
