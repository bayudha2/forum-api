/* istanbul ignore file */
const createServer = require('../src/Infrastructures/http/createServer');
const injections = require('../src/Infrastructures/injections');

const ServerTestHelper = {
  async getAddLoginAccessToken() {
    const server = await createServer(injections);

    // add user
    const addResponse = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      },
    });

    // login user
    const loginResponse = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: 'dicoding',
        password: 'secret',
      },
    });

    const id = JSON.parse(addResponse.payload).data.addedUser.id;

    const {
      data: { accessToken },
    } = JSON.parse(loginResponse.payload);

    const serverHelperPayload = {
      id,
      accessToken,
    };

    return serverHelperPayload;
  },

  async getAddLoginAccessTokenSecond() {
    const server = await createServer(injections);

    // add user
    const addResponse = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'dicoding2',
        password: 'secret2',
        fullname: 'Dicoding Indonesia 2',
      },
    });

    // login user
    const loginResponse = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: 'dicoding2',
        password: 'secret2',
      },
    });

    const id = JSON.parse(addResponse.payload).data.addedUser.id;

    const {
      data: { accessToken },
    } = JSON.parse(loginResponse.payload);

    const serverHelperPayload = {
      id,
      accessToken,
    };

    return serverHelperPayload;
  },
};

module.exports = ServerTestHelper;
