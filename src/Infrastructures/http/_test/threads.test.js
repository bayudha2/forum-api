const injections = require('../../injections');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const LikeTableTestHelper = require('../../../../tests/LikeTableTestHelper');
const Helper = require('../../../../tests/Helper');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  beforeEach(() => {
    jest.setTimeout(10000);
  });
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
    await LikeTableTestHelper.cleanTable();
    jest.useRealTimers();
  });

  describe('when POST /threads', () => {
    it('should response 201 and added thread', async () => {
      // Arrange
      const payload = {
        title: 'title',
        body: 'dummy body',
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
        url: '/threads',
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
      expect(responseJson.data.addedThread).toBeDefined();
      expect(responseJson.data.addedThread.title).toEqual(payload.title);
    });

    it('should should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const payload = {
        title: 'title',
        body: 1232,
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
        url: '/threads',
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
        'tidak dapat membuat thread baru karena tipe data tidak sesuai'
      );
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const payload = {
        title: 'title',
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
        url: '/threads',
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
        'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada'
      );
    });

    it('should response 401 if no access token', async () => {
      // Arrange
      const payload = {
        title: 'title',
        body: 'body',
      };
      const server = await createServer(injections);

      // Action
      const response = await server.inject({
        url: '/threads',
        method: 'POST',
        payload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Missing authentication');
    });
  });

  describe('when GET /threads/{threadId}', () => {
    jest.useFakeTimers('legacy');
    it('should response 200 and detail thread', async () => {
      jest.useFakeTimers('legacy');
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-222',
        username: 'dicoodingg',
      });
      const threadId = await ThreadsTableTestHelper.addThread({
        id: 'thread-333',
        owner: 'user-222',
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
      const userPayloadThird = {
        username: 'dicodingfff',
        password: 'rahasia',
        fullname: 'Dicoding sate',
      };

      const helper = new Helper();
      const { id: credentialIdOne, accessToken: accessTokenOne } =
        await helper.gateAddLoginAccess(userPayloadOne);
      const { id: credentialIdSecond, accessToken: accessTokenSecond } =
        await helper.gateAddLoginAccess(userPayloadSecond);
      const { id: credentialIdThird, accessToken: accessTokenThird } =
        await helper.gateAddLoginAccess(userPayloadThird);

      await CommentsTableTestHelper.addComment({
        id: 'comment-111',
        credentialId: credentialIdOne,
        thread_id: 'thread-333',
        date: new Date().toISOString(),
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-222',
        credentialId: credentialIdSecond,
        is_delete: true,
        thread_id: 'thread-333',
        date: new Date().toISOString(),
      });
      await LikeTableTestHelper.addLike({
        id: 'like-111',
        credentialId: credentialIdOne,
        comment_id: 'comment-111',
      });
      await LikeTableTestHelper.addLike({
        id: 'like-222',
        credentialId: credentialIdSecond,
        comment_id: 'comment-111',
      });
      await LikeTableTestHelper.addLike({
        id: 'like-333',
        credentialId: credentialIdThird,
        comment_id: 'comment-222',
      });
      await RepliesTableTestHelper.addReply({
        id: 'reply-111',
        credentialId: credentialIdThird,
        is_delete: true,
        comment_id: 'comment-111',
        date: new Date().toISOString(),
      });
      await RepliesTableTestHelper.addReply({
        id: 'reply-222',
        credentialId: credentialIdSecond,
        is_delete: false,
        comment_id: 'comment-111',
        date: new Date().toISOString(),
      });
      await RepliesTableTestHelper.addReply({
        id: 'reply-333',
        credentialId: credentialIdOne,
        is_delete: true,
        comment_id: 'comment-222',
        date: new Date().toISOString(),
      });

      const server = await createServer(injections);

      //   Action
      const response = await server.inject({
        url: `/threads/${threadId.id}`,
        method: 'GET',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
    });
  });
});
