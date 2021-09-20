/* istanbul ignore file */
const createServer = require('../src/Infrastructures/http/createServer');
const injections = require('../src/Infrastructures/injections');

class Helper {
  constructor() {
    this.gateAddLoginAccess = this.gateAddLoginAccess.bind(this);
  }

  async gateAddLoginAccess(userPayload) {
    const { username, password, fullname } = userPayload;

    const server = await createServer(injections);

    // add user
    const addResponse = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: username,
        password: password,
        fullname: fullname,
      },
    });

    // login user
    const loginResponse = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: username,
        password: password,
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
  }
}

module.exports = Helper;
