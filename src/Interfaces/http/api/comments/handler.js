class CommentsHandler {
  constructor({ addCommentUseCase, deleteCommentUseCase, likeCommentUseCase }) {
    this._addCommentUseCase = addCommentUseCase;
    this._deleteCommentUseCase = deleteCommentUseCase;
    this._likeCommentUseCase = likeCommentUseCase;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    this.putCommentHandler = this.putCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { threadId: thread_id } = request.params;

    const ids = {
      thread_id,
      credentialId,
    };
    const addedComment = await this._addCommentUseCase.execute(
      request.payload,
      ids
    );

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async putCommentHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { threadId: thread_id, commentId: comment_id } = request.params;
    const ids = { credentialId, thread_id, comment_id };
    await this._likeCommentUseCase.execute(ids);

    return {
      status: 'success',
    };
  }

  async deleteCommentHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { threadId: thread_id, commentId: comment_id } = request.params;
    const ids = { credentialId, thread_id, comment_id };

    await this._deleteCommentUseCase.execute(ids);
    return {
      status: 'success',
    };
  }
}

module.exports = CommentsHandler;
