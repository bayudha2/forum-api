const injections = require('../../injections');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const LikeTableTestHelper = require('../../../../tests/LikeTableTestHelper');
const Helper = require('../../../../tests/Helper');
const createServer = require('../createServer');

describe('/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await LikeTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and added comment', async () => {
      // Arrange
      const payload = {
        content: 'sebuah comment OK',
      };
      await UsersTableTestHelper.addUser({
        id: 'user-222',
        username: 'dicoodingg',
      });
      const threadId = await ThreadsTableTestHelper.addThread({
        owner: 'user-222',
      });

      const userPayloadOne = {
        username: 'dicodingzzzzz',
        password: 'rahasia',
        fullname: 'Dicoding Amerika ',
      };
      const helper = new Helper();
      const { accessToken } = await helper.gateAddLoginAccess(userPayloadOne);

      const server = await createServer(injections);

      // Action
      const response = await server.inject({
        url: `/threads/${threadId.id}/comments`,
        method: 'POST',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
      expect(responseJson.data.addedComment.content).toEqual(payload.content);
    });

    it('should response 404 if thread not found', async () => {
      // Arrange
      const payload = {
        content: 'sebuah comment OK',
      };

      const userPayloadOne = {
        username: 'dicodingzzzzz',
        password: 'rahasia',
        fullname: 'Dicoding Amerika ',
      };
      const helper = new Helper();
      const { accessToken } = await helper.gateAddLoginAccess(userPayloadOne);

      const server = await createServer(injections);

      // Action
      const response = await server.inject({
        url: `/threads/${''}/comments`,
        method: 'POST',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Not Found');
    });

    it('should should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const payload = {
        content: 123,
      };
      await UsersTableTestHelper.addUser({
        id: 'user-222',
        username: 'dicoodingg',
      });
      const threadId = await ThreadsTableTestHelper.addThread({
        owner: 'user-222',
      });

      const userPayloadOne = {
        username: 'dicodingzzzzz',
        password: 'rahasia',
        fullname: 'Dicoding Amerika ',
      };
      const helper = new Helper();
      const { accessToken } = await helper.gateAddLoginAccess(userPayloadOne);

      const server = await createServer(injections);

      // Action
      const response = await server.inject({
        url: `/threads/${threadId.id}/comments`,
        method: 'POST',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat comment baru karena tipe data tidak sesuai'
      );
    });

    it('should should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const payload = {};
      await UsersTableTestHelper.addUser({
        id: 'user-222',
        username: 'dicoodingg',
      });
      const threadId = await ThreadsTableTestHelper.addThread({
        owner: 'user-222',
      });

      const userPayloadOne = {
        username: 'dicodingzzzzz',
        password: 'rahasia',
        fullname: 'Dicoding Amerika ',
      };
      const helper = new Helper();
      const { accessToken } = await helper.gateAddLoginAccess(userPayloadOne);

      const server = await createServer(injections);

      // Action
      const response = await server.inject({
        url: `/threads/${threadId.id}/comments`,
        method: 'POST',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada'
      );
    });
  });

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('like the comment, should response 200 if parameters and access token valid', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-222',
        username: 'dicoodingg',
      });

      const userPayloadOne = {
        username: 'dicodingzzzzz',
        password: 'rahasia',
        fullname: 'Dicoding Amerika ',
      };

      const helper = new Helper();
      const { id: credentialId, accessToken } = await helper.gateAddLoginAccess(
        userPayloadOne
      );

      const threadId = await ThreadsTableTestHelper.addThread({
        owner: 'user-222',
      });
      const commentId = await CommentsTableTestHelper.addComment({
        credentialId: credentialId,
      });

      const server = await createServer(injections);

      // Action
      const response = await server.inject({
        url: `/threads/${threadId.id}/comments/${commentId.id}/likes`,
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('unlike the comment, should response 200 if parameters and access token valid', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-333',
        username: 'dicoodingg',
      });

      const userPayloadOne = {
        username: 'dicodingzzzzz',
        password: 'rahasia',
        fullname: 'Dicoding Amerika ',
      };

      const helper = new Helper();
      const { id: credentialId, accessToken } = await helper.gateAddLoginAccess(
        userPayloadOne
      );

      const threadId = await ThreadsTableTestHelper.addThread({
        owner: 'user-333',
      });
      const commentId = await CommentsTableTestHelper.addComment({
        credentialId: credentialId,
        id: 'comment-555',
      });
      await LikeTableTestHelper.addLike({
        id: 'like-3333',
        credentialId: credentialId,
        comment_id: 'comment-555',
      });

      const server = await createServer(injections);

      // Action
      const response = await server.inject({
        url: `/threads/${threadId.id}/comments/${commentId.id}/likes`,
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 if parameters and access token valid', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-222',
        username: 'dicoodingg',
      });

      const userPayloadOne = {
        username: 'dicodingzzzzz',
        password: 'rahasia',
        fullname: 'Dicoding Amerika ',
      };
      const helper = new Helper();
      const { id: credentialId, accessToken } = await helper.gateAddLoginAccess(
        userPayloadOne
      );

      const threadId = await ThreadsTableTestHelper.addThread({
        owner: 'user-222',
      });

      const commentId = await CommentsTableTestHelper.addComment({
        credentialId: credentialId,
      });
      const server = await createServer(injections);

      // Action
      const response = await server.inject({
        url: `/threads/${threadId.id}/comments/${commentId.id}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 401 if no access token', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-222',
        username: 'dicoodingg',
      });

      const userPayloadOne = {
        username: 'dicodingzzzzz',
        password: 'rahasia',
        fullname: 'Dicoding Amerika ',
      };
      const helper = new Helper();
      const { id: credentialId } = await helper.gateAddLoginAccess(
        userPayloadOne
      );

      const threadId = await ThreadsTableTestHelper.addThread({
        owner: 'user-222',
      });

      const commentId = await CommentsTableTestHelper.addComment({
        credentialId: credentialId,
      });
      const server = await createServer(injections);

      // Action
      const response = await server.inject({
        url: `/threads/${threadId.id}/comments/${commentId.id}`,
        method: 'DELETE',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 if comment not found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-222',
        username: 'dicoodingg',
      });

      const userPayloadOne = {
        username: 'dicodingzzzzz',
        password: 'rahasia',
        fullname: 'Dicoding Amerika ',
      };
      const helper = new Helper();
      const { id: credentialId, accessToken } = await helper.gateAddLoginAccess(
        userPayloadOne
      );

      const threadId = await ThreadsTableTestHelper.addThread({
        owner: 'user-222',
      });

      const commentId = await CommentsTableTestHelper.addComment({
        credentialId: credentialId,
      });
      const server = await createServer(injections);

      // Action
      const response = await server.inject({
        url: `/threads/${threadId.id}/comments/${''}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Not Found');
    });

    it('should response 404 if thread not found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-222',
        username: 'dicoodingg',
      });
      const userPayloadOne = {
        username: 'dicodingzzzzz',
        password: 'rahasia',
        fullname: 'Dicoding Amerika ',
      };

      const threadId = await ThreadsTableTestHelper.addThread({
        owner: 'user-222',
      });

      const helper = new Helper();
      const { id: credentialId, accessToken } = await helper.gateAddLoginAccess(
        userPayloadOne
      );

      const commentId = await CommentsTableTestHelper.addComment({
        credentialId: credentialId,
      });
      const server = await createServer(injections);

      // Action
      const response = await server.inject({
        url: `/threads/${''}/comments/${commentId.id}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Not Found');
    });

    it('should response 403 if acces token wrong', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-222',
        username: 'dicoodingg',
      });

      const userPayloadOne = {
        username: 'dicodingzzzzz',
        password: 'rahasia',
        fullname: 'Dicoding Amerika ',
      };
      const userPayloadSecond = {
        username: 'dicodingssss',
        password: 'rahasia',
        fullname: 'Dicoding situ ',
      };

      const helper = new Helper();
      const { id: credentialId } = await helper.gateAddLoginAccess(
        userPayloadOne
      );
      const { accessToken: accessTokenSecond } =
        await helper.gateAddLoginAccess(userPayloadSecond);

      const threadId = await ThreadsTableTestHelper.addThread({
        owner: 'user-222',
      });

      const commentId = await CommentsTableTestHelper.addComment({
        credentialId: credentialId,
      });

      const server = await createServer(injections);

      //   Action
      const response = await server.inject({
        url: `/threads/${threadId.id}/comments/${commentId.id}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessTokenSecond}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Akses tidak ditemukan');
    });
  });
});
