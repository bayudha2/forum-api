const NewThread = require('../NewThread');

describe('NewThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'asdsad',
    };

    // Action & Assert
    expect(() => new NewThread(payload)).toThrowError(
      'NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 'sebuah thread',
      body: true,
    };

    // Action & Assert
    expect(() => new NewThread(payload)).toThrowError(
      'NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create newThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'sebuah thread',
      body: 'sebuah body thread',
    };

    // Action
    const { title, body } = new NewThread(payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
  });
});
