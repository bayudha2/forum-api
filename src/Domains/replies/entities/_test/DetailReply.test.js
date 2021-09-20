const DetailReply = require('../DetailReply');

describe('checkDeleteReply', () => {
  it('should change content of deleted reply', async () => {
    // Arrange
    const detailReply = new DetailReply();
    const replies = [
      {
        id: 'comment-111',
        date: '2021-09-09T08:03:41.539Z',
        owner: 'user-pTf76Bdb_tqrJfH4VN9rI',
        comment_id: 'thread-333',
        is_delete: false,
      },
      {
        id: 'comment-123',
        date: '2021-09-09T08:03:41.540Z',
        owner: 'user-RZQU6MDNA5z3IpLDfRqaT',
        comment_id: 'thread-333',
        is_delete: true,
      },
    ];

    // Action
    const replyResult = await detailReply._checkDeleteReply(replies);

    // Assert
    expect(replyResult[1].content).toStrictEqual('**balasan telah dihapus**');
  });
});

describe('sortDate', () => {
  it('should sort the Date correctly', async () => {
    // Arrange
    const detailReply = new DetailReply();
    const replies = [
      {
        id: 'reply-111',
        date: '2021-09-09T08:03:41.539Z',
        owner: 'user-pTf76Bdb_tqrJfH4VN9rI',
        comment_id: 'comment-333',
        is_delete: false,
      },
      {
        id: 'reply-123',
        date: '2021-09-09T08:03:41.540Z',
        owner: 'user-RZQU6MDNA5z3IpLDfRqaT',
        comment_id: 'comment-333',
        is_delete: true,
      },
    ];

    // Action
    const dateResult = await detailReply._sortDate(replies);

    // Assert
    const date_one = new Date(dateResult[0].date).getTime();
    const date_two = new Date(dateResult[1].date).getTime();
    expect(date_one).toBeLessThan(date_two);
  });
});

describe('insertUsernameOnReply function', () => {
  it('should add username property and remove owner property', async () => {
    // Arrange
    const detailReply = new DetailReply();
    const replypayload = [
      {
        id: 'reply-111',
        content: '**balasan telah dihapus**',
        date: '2021-09-10T05:54:39.758Z',
        owner: 'user-111',
        comment_id: 'comment-111',
      },
      {
        id: 'reply-222',
        content: 'sebuah balasan',
        date: '2021-09-10T05:54:39.759Z',
        owner: 'user-222',
        comment_id: 'comment-111',
      },
      {
        id: 'reply-333',
        content: '**balasan telah dihapus**',
        date: '2021-09-10T05:54:39.760Z',
        owner: 'user-222',
        comment_id: 'comment-222',
      },
    ];
    const replyUsernamePayload = [
      { id: 'user-222', username: 'dicoodinggssss' },
      { id: 'user-111', username: 'dicoodinggtt' },
    ];

    // Action
    const replyResult = await detailReply._insertUsernameOnReply(
      replypayload,
      replyUsernamePayload
    );

    // Assert
    expect(replyResult[0]).toHaveProperty('username');
  });
});
