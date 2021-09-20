const DetailComment = require('../DetailComment');

describe('checkDeleteComment', () => {
  it('should change content of deleted comment', async () => {
    // Arrange
    const detailComment = new DetailComment();
    const comments = [
      {
        id: 'comment-111',
        content: 'sebuah comment',
        date: '2021-09-09T08:03:41.539Z',
        owner: 'user-pTf76Bdb_tqrJfH4VN9rI',
        thread_id: 'thread-333',
        is_delete: false,
      },
      {
        id: 'comment-123',
        content: 'sebuah comment',
        date: '2021-09-09T08:03:41.540Z',
        owner: 'user-RZQU6MDNA5z3IpLDfRqaT',
        thread_id: 'thread-333',
        is_delete: true,
      },
    ];

    // Action
    const commentResult = await detailComment._checkDeleteComment(comments);

    // Assert
    expect(commentResult[1].content).toStrictEqual(
      '**komentar telah dihapus**'
    );
  });
});

describe('sortDate', () => {
  it('should sort the Date correctly', async () => {
    // Arrange
    const detailComment = new DetailComment();
    const comments = [
      {
        id: 'comment-111',
        content: 'sebuah comment',
        date: '2021-09-09T08:03:41.520Z',
        owner: 'user-pTf76Bdb_tqrJfH4VN9rI',
        thread_id: 'thread-333',
        is_delete: false,
      },
      {
        id: 'comment-123',
        content: 'sebuah comment',
        date: '2021-09-09T08:03:41.540Z',
        owner: 'user-RZQU6MDNA5z3IpLDfRqaT',
        thread_id: 'thread-333',
        is_delete: true,
      },
    ];

    // Action
    const dateResult = await detailComment._sortDate(comments);

    // Assert
    const date_one = new Date(dateResult[0].date).getTime();
    const date_two = new Date(dateResult[1].date).getTime();
    expect(date_one).toBeLessThan(date_two);
  });
});

describe('insertUsernameOnThread function', () => {
  it('should add username property and remove owner property', async () => {
    // Arrange
    const detailComment = new DetailComment();
    const commentpayload = [
      {
        id: 'comment-111',
        content: 'sebuah comment',
        date: '2021-09-10T03:37:07.006Z',
        owner: 'user-111',
        thread_id: 'thread-333',
      },
      {
        id: 'comment-222',
        content: '**komentar telah dihapus**',
        date: '2021-09-10T03:37:07.007Z',
        owner: 'user-222',
        thread_id: 'thread-333',
      },
    ];
    const commentUsernamePayload = [
      { id: 'user-222', username: 'dicoodinggssss' },
      { id: 'user-111', username: 'dicoodinggtt' },
    ];

    // Action
    const commentResult = await detailComment._insertUsernameOnComment(
      commentpayload,
      commentUsernamePayload
    );
    // Assert
    expect(commentResult[0]).toHaveProperty('username');
  });

  it('should not add username property and remove owner property', async () => {
    // Arrange
    const detailComment = new DetailComment();
    const commentpayload = [
      {
        id: 'comment-111',
        content: 'sebuah comment',
        date: '2021-09-10T03:37:07.006Z',
        owner: 'user-111',
        thread_id: 'thread-333',
      },
      {
        id: 'comment-222',
        content: '**komentar telah dihapus**',
        date: '2021-09-10T03:37:07.007Z',
        owner: 'user-222',
        thread_id: 'thread-333',
      },
    ];
    const commentUsernamePayload = [
      { id: 'user-444', username: 'dicoodinggssss' },
      { id: 'user-555', username: 'dicoodinggtt' },
    ];

    // Action
    const commentResult = await detailComment._insertUsernameOnComment(
      commentpayload,
      commentUsernamePayload
    );
    // Assert
    expect(commentResult[0]).toHaveProperty('owner');
  });
});

describe('inserCountLike', () => {
  it('should insert countLike to comment correctly', async () => {
    // Arrange
    const detailComment = new DetailComment();
    const commentsPayload = [
      {
        id: 'comment-111',
        date: '2021-09-10T06:07:03.407Z',
        content: 'sebuah comment',
        username: 'dicodingzzzzz',
      },
      {
        id: 'comment-222',
        date: '2021-09-10T06:07:03.408Z',
        content: '**komentar telah dihapus**',
        username: 'dicodingssss',
      },
    ];
    const totalLike = [
      { id: 'like-111', comment_id: 'comment-111' },
      { id: 'like-222', comment_id: 'comment-111' },
      { id: 'like-333', comment_id: 'comment-222' },
    ];

    // Action
    const result = await detailComment._insertCountLike(
      commentsPayload,
      totalLike
    );

    // Assert
    expect(result[0]).toHaveProperty('likeCount');
  });
});

describe('insertReplyToComment', () => {
  it('should insert replies to comment correctly', async () => {
    // Arrange
    const detailComment = new DetailComment();
    const commentsPayload = [
      {
        id: 'comment-111',
        date: '2021-09-10T06:07:03.407Z',
        content: 'sebuah comment',
        username: 'dicodingzzzzz',
      },
      {
        id: 'comment-222',
        date: '2021-09-10T06:07:03.408Z',
        content: '**komentar telah dihapus**',
        username: 'dicodingssss',
      },
    ];
    const repliesPayload = [
      {
        id: 'reply-111',
        content: '**balasan telah dihapus**',
        date: '2021-09-10T06:07:03.409Z',
        comment_id: 'comment-111',
        username: 'dicodingfff',
      },
      {
        id: 'reply-222',
        content: 'sebuah balasan',
        date: '2021-09-10T06:07:03.410Z',
        comment_id: 'comment-111',
        username: 'dicodingssss',
      },
      {
        id: 'reply-333',
        content: '**balasan telah dihapus**',
        date: '2021-09-10T06:07:03.411Z',
        comment_id: 'comment-222',
        username: 'dicodingzzzzz',
      },
    ];

    // Action
    const result = await detailComment._insertReplyToComment(
      commentsPayload,
      repliesPayload
    );

    // Assert
    expect(result[0]).toHaveProperty('replies');
  });
});
