class ThreadsHandler {
  constructor({ addThreadUseCase, getThreadUseCase, getDetailThreadUseCase }) {
    this._addThreadUseCase = addThreadUseCase;
    this._getThreadUseCase = getThreadUseCase;
    this._getDetailThreadUseCase = getDetailThreadUseCase;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;

    const addedThread = await this._addThreadUseCase.execute(
      request.payload,
      credentialId
    );

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadHandler(request, h) {
    const { threadId: thread_id } = request.params;
    const ids = {
      thread_id,
    };

    const thread = await this._getDetailThreadUseCase.execute(ids);

    const response = h.response({
      status: 'success',
      data: {
        thread,
      },
    });
    return response;
  }
}

module.exports = ThreadsHandler;
