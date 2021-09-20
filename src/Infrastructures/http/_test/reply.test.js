const injections = require('../../injections');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const Helper = require('../../../../tests/Helper');
const createServer = require('../createServer');

describe('/replies endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and added reply', async () => {
      // Arrange
      const payload = {
        content: 'sebuah balasan OK',
      };
      await UsersTableTestHelper.addUser({
        id: 'user-222',
        username: 'dicoodingg',
      });
      await UsersTableTestHelper.addUser({
        id: 'user-334',
        username: 'dicoodingg3',
      });
      const threadId = await ThreadsTableTestHelper.addThread({
        id: 'thread-4321',
        owner: 'user-222',
      });
      const commentId = await CommentsTableTestHelper.addComment({
        id: 'comment-555',
        thread_id: 'thread-4321',
        credentialId: 'user-334',
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
        url: `/threads/${threadId.id}/comments/${commentId.id}/replies`,
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
      expect(responseJson.data.addedReply).toBeDefined();
      expect(responseJson.data.addedReply.content).toEqual(payload.content);
    });

    it('should response 404 if thread not found', async () => {
      // Arrange
      const payload = {
        content: 'sebuah balasan OK',
      };
      await UsersTableTestHelper.addUser({
        id: 'user-222',
        username: 'dicoodingg',
      });
      await UsersTableTestHelper.addUser({
        id: 'user-334',
        username: 'dicoodingg3',
      });
      const threadId = await ThreadsTableTestHelper.addThread({
        id: 'thread-4321',
        owner: 'user-222',
      });
      const commentId = await CommentsTableTestHelper.addComment({
        id: 'comment-555',
        thread_id: 'thread-4321',
        credentialId: 'user-334',
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
        url: `/threads/${''}/comments/${commentId.id}/replies`,
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

    it('should response 404 if comment not found', async () => {
      // Arrange
      const payload = {
        content: 'sebuah balasan OK',
      };
      await UsersTableTestHelper.addUser({
        id: 'user-222',
        username: 'dicoodingg',
      });
      await UsersTableTestHelper.addUser({
        id: 'user-334',
        username: 'dicoodingg3',
      });
      const threadId = await ThreadsTableTestHelper.addThread({
        id: 'thread-4321',
        owner: 'user-222',
      });
      const commentId = await CommentsTableTestHelper.addComment({
        id: 'comment-555',
        thread_id: 'thread-4321',
        credentialId: 'user-334',
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
        url: `/threads/${threadId.id}/comments/${''}/replies`,
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

    it('should should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const payload = {};
      await UsersTableTestHelper.addUser({
        id: 'user-222',
        username: 'dicoodingg',
      });
      await UsersTableTestHelper.addUser({
        id: 'user-334',
        username: 'dicoodingg3',
      });
      const threadId = await ThreadsTableTestHelper.addThread({
        id: 'thread-4321',
        owner: 'user-222',
      });
      const commentId = await CommentsTableTestHelper.addComment({
        id: 'comment-555',
        thread_id: 'thread-4321',
        credentialId: 'user-334',
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
        url: `/threads/${threadId.id}/comments/${commentId.id}/replies`,
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

    it('should should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const payload = {
        content: 123,
      };
      await UsersTableTestHelper.addUser({
        id: 'user-222',
        username: 'dicoodingg',
      });
      await UsersTableTestHelper.addUser({
        id: 'user-334',
        username: 'dicoodingg3',
      });
      const threadId = await ThreadsTableTestHelper.addThread({
        id: 'thread-4321',
        owner: 'user-222',
      });
      const commentId = await CommentsTableTestHelper.addComment({
        id: 'comment-555',
        thread_id: 'thread-4321',
        credentialId: 'user-334',
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
        url: `/threads/${threadId.id}/comments/${commentId.id}/replies`,
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
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 200 if parameters and access token valid', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-222',
        username: 'dicoodingg',
      });
      await UsersTableTestHelper.addUser({
        id: 'user-334',
        username: 'dicoodingg3',
      });
      const threadId = await ThreadsTableTestHelper.addThread({
        id: 'thread-4321',
        owner: 'user-222',
      });
      const commentId = await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        thread_id: 'thread-4321',
        credentialId: 'user-334',
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

      const replyId = await RepliesTableTestHelper.addReply({
        credentialId: credentialId,
      });

      const server = await createServer(injections);

      // Action
      const response = await server.inject({
        url: `/threads/${threadId.id}/comments/${commentId.id}/replies/${replyId.id}`,
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
      await UsersTableTestHelper.addUser({
        id: 'user-334',
        username: 'dicoodingg3',
      });
      const threadId = await ThreadsTableTestHelper.addThread({
        id: 'thread-4321',
        owner: 'user-222',
      });
      const commentId = await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        thread_id: 'thread-4321',
        credentialId: 'user-334',
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

      const replyId = await RepliesTableTestHelper.addReply({
        credentialId: credentialId,
      });

      const server = await createServer(injections);

      // Action
      const response = await server.inject({
        url: `/threads/${threadId.id}/comments/${commentId.id}/replies/${replyId.id}`,
        method: 'DELETE',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 if thread not found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-222',
        username: 'dicoodingg',
      });
      await UsersTableTestHelper.addUser({
        id: 'user-334',
        username: 'dicoodingg3',
      });
      const threadId = await ThreadsTableTestHelper.addThread({
        id: 'thread-4321',
        owner: 'user-222',
      });
      const commentId = await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        thread_id: 'thread-4321',
        credentialId: 'user-334',
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

      const replyId = await RepliesTableTestHelper.addReply({
        credentialId: credentialId,
      });

      const server = await createServer(injections);

      // Action
      const response = await server.inject({
        url: `/threads/${''}/comments/${commentId.id}/replies/${replyId.id}`,
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

    it('should response 404 if comment not found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-222',
        username: 'dicoodingg',
      });
      await UsersTableTestHelper.addUser({
        id: 'user-334',
        username: 'dicoodingg3',
      });
      const threadId = await ThreadsTableTestHelper.addThread({
        id: 'thread-4321',
        owner: 'user-222',
      });
      const commentId = await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        thread_id: 'thread-4321',
        credentialId: 'user-334',
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

      const replyId = await RepliesTableTestHelper.addReply({
        credentialId: credentialId,
      });

      const server = await createServer(injections);

      // Action
      const response = await server.inject({
        url: `/threads/${threadId.id}/comments/${''}/replies/${replyId.id}`,
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

    it('should response 404 if reply not found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-222',
        username: 'dicoodingg',
      });
      await UsersTableTestHelper.addUser({
        id: 'user-334',
        username: 'dicoodingg3',
      });
      const threadId = await ThreadsTableTestHelper.addThread({
        id: 'thread-4321',
        owner: 'user-222',
      });
      const commentId = await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        thread_id: 'thread-4321',
        credentialId: 'user-334',
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

      const replyId = await RepliesTableTestHelper.addReply({
        credentialId: credentialId,
      });

      const server = await createServer(injections);

      // Action
      const response = await server.inject({
        url: `/threads/${threadId.id}/comments/${commentId.id}/replies/${''}`,
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
      await UsersTableTestHelper.addUser({
        id: 'user-334',
        username: 'dicoodingg3',
      });
      const threadId = await ThreadsTableTestHelper.addThread({
        id: 'thread-3333',
        owner: 'user-222',
      });
      const commentId = await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        thread_id: 'thread-3333',
        credentialId: 'user-334',
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
      const { id: credentialIdOne } = await helper.gateAddLoginAccess(
        userPayloadOne
      );
      const { accessToken: accessTokenSecond } =
        await helper.gateAddLoginAccess(userPayloadSecond);

      const replyId = await RepliesTableTestHelper.addReply({
        id: 'reply-333',
        credentialId: credentialIdOne,
      });

      const server = await createServer(injections);

      // Action
      const response = await server.inject({
        url: `/threads/${threadId.id}/comments/${commentId.id}/replies/${replyId.id}`,
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
