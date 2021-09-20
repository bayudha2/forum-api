class RepliesHandler {
  constructor({ addReplyUseCase, deleteReplyUseCase }) {
    this._addReplyUseCase = addReplyUseCase;
    this._deleteReplyUseCase = deleteReplyUseCase;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { threadId: thread_id, commentId: comment_id } = request.params;
    const ids = {
      thread_id,
      comment_id,
      credentialId,
    };

    const addedReply = await this._addReplyUseCase.execute(
      request.payload,
      ids
    );

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const {
      threadId: thread_id,
      commentId: comment_id,
      replyId: reply_id,
    } = request.params;
    const ids = { thread_id, comment_id, reply_id, credentialId };

    await this._deleteReplyUseCase.execute(ids);
    return {
      status: 'success',
    };
  }
}

module.exports = RepliesHandler;
